import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import styles from './styles';
import Shop, { items } from './Shop';

const flavorTexts = ['Cooking...', 'Hawking Tuah...', 'Sigmaing the Sigma on the wall...', 'Unfollowing Vexbolts...', 'Raising my yayaya...', 'Playing these games before...', 'Finding those who know...', 'Holding space...']
const emojis = ['💀', '👽', '🤖', '👅', '🫱', '🖕', '🗣️', '🧜‍♂️', '👯', '🧢', '🫃', '🌝', '⚓️', '🎋', '🪵', '🍃', '🌾', '🗿', '🪫', '🥀', '🍆']

export default function App() {
  const [points, setPoints] = useState(0);
  const [randomEmoji, setRandomEmoji] = useState('');
  const [isShopExpanded, setIsShopExpanded] = useState(false);
  const [ownedItems, setOwnedItems] = useState({});
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shopHeightAnim = useRef(new Animated.Value(100)).current;
  

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => subscription?.remove();
  }, []);

  // Set up per second points generation
  useEffect(() => {
    const interval = setInterval(() => {
      const perSecondPoints = Object.entries(ownedItems).reduce((total, [itemId, count]) => {
        const item = items.find(i => i.id === parseInt(itemId));
        return total + (item && item.type === 'perSecond' ? item.value * count : 0);
      }, 0);
      
      if (perSecondPoints > 0) {
        setPoints(prev => prev + perSecondPoints);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ownedItems]);

  const toggleShop = () => {
    const toValue = isShopExpanded ? 100 : screenHeight * 0.8;
    Animated.spring(shopHeightAnim, {
      toValue,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
    setIsShopExpanded(!isShopExpanded);
  };

  const changeEmoji = () => {
    let newEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    if (newEmoji === randomEmoji) {
      changeEmoji();
    } else {
      setRandomEmoji(newEmoji);
    }
  }

  useEffect(() => {
    changeEmoji();
  }, [points]);

  const calculateClickValue = () => {
    const baseValue = 1;
    const multiplier = Object.entries(ownedItems).reduce((total, [itemId, count]) => {
      const item = items.find(i => i.id === parseInt(itemId));
      return total + (item && item.type === 'multiplier' ? item.value * count : 0);
    }, 1);

    const clickBonus = Object.entries(ownedItems).reduce((total, [itemId, count]) => {
      const item = items.find(i => i.id === parseInt(itemId));
      return total + (item && item.type === 'clickBonus' ? item.value * count : 0);
    }, 0);

    return (baseValue * multiplier) + clickBonus;
  };

  const handlePurchase = (item) => {
    if (points >= item.cost) {
      setPoints(prev => prev - item.cost);
      setOwnedItems(prev => ({
        ...prev,
        [item.id]: (prev[item.id] || 0) + 1
      }));
    }
  };

  const handleTap = () => {
    // Animate the button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Add points with all effects
    const clickValue = calculateClickValue();
    setPoints(prev => prev + clickValue);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>{points.toLocaleString()}</Text>
      </View>

      <TouchableOpacity onPress={handleTap}>
        <Animated.View style={[styles.brainButton, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.brainText}>{randomEmoji}</Text>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.shopContainer, { height: shopHeightAnim }]}>
        <TouchableOpacity 
          style={styles.shopHeader}
          onPress={toggleShop}
        >
          <Text style={styles.shopButtonText}>
            {isShopExpanded ? '▼  Item Shop' : '▶  Item Shop'}
          </Text>
        </TouchableOpacity>

        <View style={styles.shopContent}>
          <Shop 
            points={points}
            onPurchase={handlePurchase}
            ownedItems={ownedItems}
          />
        </View>
      </Animated.View>
    </View>
  );
}
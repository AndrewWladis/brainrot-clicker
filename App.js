import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import styles from './styles';
import Shop from './Shop';

const flavorTexts = ['Cooking...', 'Hawking Tuah...', 'Sigmaing the Sigma on the wall...', 'Unfollowing Vexbolts...', 'Raising my yayaya...', 'Playing these games before...', 'Finding those who know...', 'Holding space...']
const emojis = ['💀', '👽', '🤖', '👅', '🫱', '🖕', '🗣️', '🥷', '🧜‍♂️', '👯', '🧢', '🫃', '🌝', '⚓️', '🎋', '🪵', '🍃', '🌾', '🗿', '🪫', '🥀', '🍆']

export default function App() {
  const [points, setPoints] = useState(0);
  const [flavorText, setFlavorText] = useState('');
  const [randomEmoji, setRandomEmoji] = useState('');
  const [showShop, setShowShop] = useState(false);
  const [ownedItems, setOwnedItems] = useState({});
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  const calculateMultiplier = () => {
    return Object.entries(ownedItems).reduce((total, [itemId, count]) => {
      const item = Shop.items.find(i => i.id === parseInt(itemId));
      return total + (item ? item.multiplier * count : 0);
    }, 1);
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

    // Add points with multiplier
    const multiplier = calculateMultiplier();
    setPoints(prev => prev + multiplier);

    // Show random flavor text
    const randomText = flavorTexts[Math.floor(Math.random() * flavorTexts.length)];
    setFlavorText(randomText);
    
    // Clear flavor text after 2 seconds
    setTimeout(() => {
      setFlavorText('');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>{points}</Text>
      </View>

      <TouchableOpacity onPress={handleTap}>
        <Animated.View style={[styles.brainButton, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.brainText}>{randomEmoji}</Text>
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.shopButton}
        onPress={() => setShowShop(!showShop)}
      >
        <Text style={styles.shopButtonText}>{showShop ? 'Close Item Shop' : 'Item Shop'}</Text>
      </TouchableOpacity>

      {showShop && (
        <Shop 
          points={points}
          onPurchase={handlePurchase}
          ownedItems={ownedItems}
        />
      )}

      {flavorText ? (
        <Text style={styles.flavorText}>{flavorText}</Text>
      ) : null}
    </View>
  );
}
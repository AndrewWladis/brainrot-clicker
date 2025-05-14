import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import Shop, { items } from './Shop';

const flavorTexts = ['Cooking...', 'Hawking Tuah...', 'Sigmaing the Sigma on the wall...', 'Unfollowing Vexbolts...', 'Raising my yayaya...', 'Playing these games before...', 'Finding those who know...', 'Holding space...']
const emojis = ['💀', '👽', '🤖', '👅', '🫱', '🖕', '🗣️', '🧜‍♂️', '👯', '🧢', '🫃', '🌝', '⚓️', '🎋', '🪵', '🍃', '🌾', '🗿', '🪫', '🥀', '🍆']

const logOwnedItems = (ownedItems) => {
  const ownedItemsList = Object.entries(ownedItems)
    .map(([itemId, count]) => {
      const item = items.find(i => i.id === parseInt(itemId));
      if (!item) return null;
      return `${item.name}: ${count} (${item.type === 'multiplier' ? '×' + item.value : 
        item.type === 'clickBonus' ? '+' + item.value : 
        item.type === 'perSecond' ? item.value + '/s' : ''})`;
    })
    .filter(Boolean);

  if (ownedItemsList.length > 0) {
    console.log('\n=== Your Inventory ===');
    ownedItemsList.forEach(item => console.log(item));
    console.log('====================\n');
  } else {
    console.log('\n=== No items owned yet ===\n');
  }
};

export default function App() {
  const [points, setPoints] = useState(0);
  const [randomEmoji, setRandomEmoji] = useState('');
  const [isShopExpanded, setIsShopExpanded] = useState(false);
  const [ownedItems, setOwnedItems] = useState({});
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shopHeightAnim = useRef(new Animated.Value(100)).current;
  const lastSaveTime = useRef(Date.now());
  

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => subscription?.remove();
  }, []);

  // Load saved game data
  useEffect(() => {
    const loadGameData = async () => {
      try {
        console.log('Attempting to load game data...');
        const savedData = await AsyncStorage.getItem('gameData');
        console.log('Raw saved data:', savedData);
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('Parsed data:', parsedData);
          
          // Ensure we have valid data before setting state
          if (typeof parsedData.points === 'number' && typeof parsedData.ownedItems === 'object') {
            setPoints(parsedData.points);
            setOwnedItems(parsedData.ownedItems);
            console.log('Successfully loaded:');
            console.log('Points:', parsedData.points);
            console.log('Owned Items:', parsedData.ownedItems);
            logOwnedItems(parsedData.ownedItems);
          } else {
            console.log('Invalid saved data format:', parsedData);
            // If data is invalid, clear it and start fresh
            await AsyncStorage.removeItem('gameData');
            console.log('Cleared invalid save data');
          }
        } else {
          console.log('No saved data found, creating initial save...');
          // Create an initial save to verify storage is working
          const initialData = {
            points: 0,
            ownedItems: {},
            lastSaved: Date.now()
          };
          await AsyncStorage.setItem('gameData', JSON.stringify(initialData));
          console.log('Created initial save data');
        }
      } catch (error) {
        console.error('Error loading game data:', error);
        // Reset to initial state if there's an error
        setPoints(0);
        setOwnedItems({});
      }
    };

    loadGameData();
  }, []);

  // Save game data function
  const saveGameData = async () => {
    try {
      const gameData = {
        points,
        ownedItems,
        lastSaved: Date.now()
      };
      console.log('Saving game data:', gameData);
      await AsyncStorage.setItem('gameData', JSON.stringify(gameData));
      lastSaveTime.current = Date.now();
      console.log('Game data saved successfully');
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  // Periodic autosave every 30 seconds
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      if (points > 0 || Object.keys(ownedItems).length > 0) {
        saveGameData();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autosaveInterval);
  }, [points, ownedItems]);

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

  const handlePurchase = async (item) => {
    if (points >= item.cost) {
      // Update points first
      const newPoints = points - item.cost;
      setPoints(newPoints);
      
      // Update owned items
      const newOwnedItems = {
        ...ownedItems,
        [item.id]: (ownedItems[item.id] || 0) + 1
      };
      setOwnedItems(newOwnedItems);
      
      // Save immediately after purchase
      try {
        const gameData = {
          points: newPoints,
          ownedItems: newOwnedItems,
          lastSaved: Date.now()
        };
        console.log('Saving after purchase:', gameData);
        await AsyncStorage.setItem('gameData', JSON.stringify(gameData));
        lastSaveTime.current = Date.now();
        console.log('Purchase saved successfully');
      } catch (error) {
        console.error('Error saving purchase:', error);
      }
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
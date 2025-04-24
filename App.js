import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import styles from './styles';

const flavorTexts = ['Cooking...', 'Hawking Tuah...', 'Sigmaing the Sigma on the wall...', 'Unfollowing Vexbolts...', 'Loading...', 'Raising my yayaya...', 'Playing these games before...', 'Finding those who know...', 'Holding space...']
const emojis = ['💀', '👽', '🤖', '👅', '🫱', '🖕', '🗣️', '🥷', '🧜‍♂️', '👯', '🧢', '🫃', '🌝', '⚓️', '🎋', '🪵', '🍃', '🌾', '🗿', '🪫', '🥀', '🍆']

export default function App() {
  const [points, setPoints] = useState(0);
  const [flavorText, setFlavorText] = useState('');
  const [randomEmoji, setRandomEmoji] = useState('');
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

    // Add points
    setPoints(prev => prev + 1);

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

      {flavorText ? (
        <Text style={styles.flavorText}>{flavorText}</Text>
      ) : null}
    </View>
  );
}
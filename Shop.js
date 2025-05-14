import React from 'react';
import styles from './styles';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const items = [
  // Click multiplier items
  { 
    id: 1, 
    name: 'We gotta do at least 10k bro', 
    cost: 25, 
    type: 'multiplier',
    lightColor: '#e3e3e3',
    darkColor: '#121212',
    value: 2, 
    description: 'Double your points per click' 
  },
  { 
    id: 3, 
    name: 'I call it a 3x multiplier, ryhmes with Grug', 
    cost: 50, 
    type: 'multiplier',
    lightColor: '#2e1c0b',
    darkColor: '#c7a685',
    value: 3, 
    description: 'Triple your points per click' 
  },
  // Per click bonus items
  { 
    id: 456, 
    name: 'IVE PLAYED THESE GAMES BEFORE', 
    cost: 45600, 
    type: 'clickBonus',
    value: 456, 
    lightColor: '#ed93de',
    darkColor: '#037a76',
    description: '+456 points per click' 
  },
  { 
    id: 808, 
    name: '808 CRASHOUT', 
    cost: 80800, 
    type: 'clickBonus',
    value: 808, 
    lightColor: '#e6575e',
    darkColor: '1a1a1a',
    description: '+808 points per click' 
  },
  // Per second items
  { 
    id: 4, 
    name: 'MUSTARD!', 
    cost: 100, 
    type: 'perSecond',
    value: 1, 
    darkColor: '#e6da40',
    lightColor: '#595847',
    description: 'Generate 1 point per second' 
  },
  { 
    id: 67, 
    name: 'SIX SEVEN!!!!', 
    cost: 67000, 
    type: 'perSecond',
    value: 67, 
    darkColor: '#f5e3ba',
    lightColor: '#b5af0e',
    description: 'Generate 67 points per second' 
  },
  { 
    id: 2, 
    name: 'Escape the Matrix', 
    cost: 300, 
    type: 'perSecond',
    value: 3, 
    lightColor: '#57e657',
    darkColor: 'black',
    description: 'Generate 3 points per second' 
  },
];

export { items };

const Shop = ({ points, onPurchase, ownedItems }) => {
  const getEffectText = (item) => {
    switch (item.type) {
      case 'multiplier':
        return `×${item.value}`;
      case 'clickBonus':
        return `+${item.value}`;
      case 'perSecond':
        return `${item.value}/s`;
      default:
        return '';
    }
  };

  const getItemStyle = (item, isAvailable) => {
    const baseStyle = [styles.item];
    if (item.lightColor && item.darkColor) {
      baseStyle.push({
        backgroundColor: isAvailable ? item.darkColor : `${item.darkColor}80`, // 50% opacity when unavailable
        borderColor: item.lightColor,
      });
    } else {
      baseStyle.push(isAvailable ? styles.available : styles.unavailable);
    }
    return baseStyle;
  };

  const getCostStyle = (item, isAvailable) => {
    const baseStyle = [styles.itemCost];
    if (item.lightColor) {
      baseStyle.push({
        color: isAvailable ? item.lightColor : item.lightColor,
        textShadowColor: isAvailable ? item.lightColor : 'transparent',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 3,
      });
    } else {
      baseStyle.push(isAvailable ? styles.costAvailable : styles.costUnavailable);
    }
    return baseStyle;
  };

  // Sort items by cost
  const sortedItems = [...items].sort((a, b) => a.cost - b.cost);

  return (
    <View style={styles.shopContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.pointsAvailable}>{points} Aura</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {sortedItems.map((item) => {
          const isAvailable = points >= item.cost;
          return (
            <TouchableOpacity
              key={item.id}
              style={getItemStyle(item, isAvailable)}
              onPress={() => isAvailable && onPurchase(item)}
              disabled={!isAvailable}
            >
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={[
                    styles.itemName,
                    item.lightColor && { color: item.lightColor }
                  ]}>
                    {item.name}
                  </Text>
                  <Text style={[
                    styles.multiplierText,
                    item.lightColor && {
                      color: item.lightColor,
                      textShadowColor: item.lightColor
                    }
                  ]}>
                    {getEffectText(item)}
                  </Text>
                </View>
                <Text style={[
                  styles.itemDescription,
                  item.lightColor && { color: item.lightColor }
                ]}>
                  {item.description}
                </Text>
                <View style={styles.itemFooter}>
                  <Text style={getCostStyle(item, isAvailable)}>
                    Cost: {item.cost} aura
                  </Text>
                  <View style={styles.ownedContainer}>
                    <Text style={[
                      styles.ownedLabel,
                      item.lightColor && { color: item.lightColor }
                    ]}>
                      Owned:
                    </Text>
                    <Text style={[
                      styles.ownedCount,
                      item.lightColor && {
                        color: item.lightColor,
                        textShadowColor: item.lightColor
                      }
                    ]}>
                      {ownedItems[item.id] || 0}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Shop; 
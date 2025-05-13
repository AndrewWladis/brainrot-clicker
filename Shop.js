import React from 'react';
import styles from './styles';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const items = [
  // Click multiplier items
  { 
    id: 1, 
    name: 'Brain Boost', 
    cost: 10, 
    type: 'multiplier',
    value: 2, 
    description: 'Double your points per click' 
  },
  { 
    id: 2, 
    name: 'Brain Blast', 
    cost: 50, 
    type: 'multiplier',
    value: 5, 
    description: '5x points per click' 
  },
  // Per click bonus items
  { 
    id: 3, 
    name: 'Quick Tap', 
    cost: 25, 
    type: 'clickBonus',
    value: 5, 
    description: '+5 points per click' 
  },
  { 
    id: 4, 
    name: 'Power Tap', 
    cost: 100, 
    type: 'clickBonus',
    value: 20, 
    description: '+20 points per click' 
  },
  { 
    id: 456, 
    name: 'IVE PLAYED THESE GAMES BEFORE', 
    cost: 40000, 
    type: 'clickBonus',
    value: 456, 
    description: '+456 points per click' 
  },
  // Per second items
  { 
    id: 5, 
    name: 'Auto Brain', 
    cost: 75, 
    type: 'perSecond',
    value: 1, 
    description: 'Generate 1 point per second' 
  },
  { 
    id: 6, 
    name: 'Brain Factory', 
    cost: 300, 
    type: 'perSecond',
    value: 5, 
    description: 'Generate 5 points per second' 
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

  // Sort items by cost
  const sortedItems = [...items].sort((a, b) => a.cost - b.cost);

  return (
    <View style={styles.shopContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.pointsAvailable}>{points} Aura</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {sortedItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.item,
              points >= item.cost ? styles.available : styles.unavailable,
            ]}
            onPress={() => points >= item.cost && onPurchase(item)}
            disabled={points < item.cost}
          >
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.multiplierText}>{getEffectText(item)}</Text>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.itemFooter}>
                <Text style={[
                  styles.itemCost,
                  points >= item.cost ? styles.costAvailable : styles.costUnavailable
                ]}>
                  {item.cost} aura
                </Text>
                <View style={styles.ownedContainer}>
                  <Text style={styles.ownedLabel}>Owned:</Text>
                  <Text style={styles.ownedCount}>{ownedItems[item.id] || 0}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Shop; 
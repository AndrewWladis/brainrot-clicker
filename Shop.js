import React from 'react';
import styles from './styles';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const items = [
  { id: 1, name: 'Brain Boost', cost: 10, multiplier: 2, description: 'Double your points per click' },
  { id: 2, name: 'Brain Blast', cost: 50, multiplier: 5, description: '5x points per click' },
  { id: 3, name: 'Brain Explosion', cost: 200, multiplier: 10, description: '10x points per click' },
  { id: 4, name: 'Brain Overdrive', cost: 1000, multiplier: 20, description: '20x points per click' },
];

export { items };

const Shop = ({ points, onPurchase, ownedItems }) => {
  return (
    <View style={styles.shopContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.pointsAvailable}>{points} Aura</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {items.map((item) => (
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
                <Text style={styles.multiplierText}>×{item.multiplier}</Text>
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
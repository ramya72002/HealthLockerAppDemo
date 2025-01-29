import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MedicalFooter = ({ onCalendarPress, onAddPress, onViewPress }) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.footerItem} onPress={onCalendarPress}>
        <Text style={styles.footerText}>Calendar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} onPress={onAddPress}>
        <Text style={styles.footerText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} onPress={onViewPress}>
        <Text style={styles.footerText}>View</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // evenly spaces items with no extra space on either side
    alignItems: 'center',
    backgroundColor: '#f8f8f8', // Light grey background for a modern look
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1', // Slightly lighter border for a softer look
    width: '100%',
  },
  footerItem: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.3s', // Smooth transition for background color change on hover
  },
  footerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555', // Slightly darker text for better readability
    textAlign: 'center',
  },
  // Optional: Add hover effect for a modern feel (will work on web, you can implement a custom version for mobile if desired)
  footerItemHovered: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default MedicalFooter;

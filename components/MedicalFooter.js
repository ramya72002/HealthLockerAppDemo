import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const MedicalFooter = () => {
  const navigation = useNavigation(); // Initialize navigation

  const handleCalendarPress = () => {
    navigation.navigate("CalendarView"); // Navigate to CalendarView screen
  };

  const handleAddPress = () => {
    navigation.navigate("AddMedications"); // Navigate to AddMedications screen
  };

  const handleViewPress = () => {
    navigation.navigate("MedView"); // Navigate to MedView screen
  };

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.footerItem} onPress={handleCalendarPress}>
        <Text style={styles.footerText}>Calendar View</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} onPress={handleAddPress}>
        <Text style={styles.footerText}>Add Med</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} onPress={handleViewPress}>
        <Text style={styles.footerText}>Med View</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    width: '100%',
  },
  footerItem: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
  },
});

export default MedicalFooter;

import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import MedicalFooter from '../components/MedicalFooter'; // Import the footer

const Medications = () => {
  const [medicationName, setMedicationName] = useState('');
  const [frequency, setFrequency] = useState('Every day');
  const [count, setCount] = useState('');
  const [schedule, setSchedule] = useState([
    { time: '07:00', dosage: '1.0' },
    { time: '13:00', dosage: '1.0' },
    { time: '19:00', dosage: '1.0' },
  ]);
  const [editMode, setEditMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });
  const [selectedDates, setSelectedDates] = useState([]);

  const handleAddMedication = () => {
    console.log('Medication Added:', medicationName, frequency, schedule);
  };

  const handleDelete = (index) => {
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(updatedSchedule);
  };

  const handleEditRow = (index) => {
    setSelectedRow(index);
    setEditMode(true);
  };

  const handleSaveRow = () => {
    const updatedSchedule = [...schedule];
    updatedSchedule[selectedRow].time = updatedSchedule[selectedRow].time;
    updatedSchedule[selectedRow].dosage = updatedSchedule[selectedRow].dosage;
    setSchedule(updatedSchedule);
    setEditMode(false);
  };

  const handleSelectFrequency = (selectedFrequency) => {
    setFrequency(selectedFrequency);
    if (selectedFrequency === 'Day of the week') {
      setCount(''); // Clear the count if frequency is "Day of the week"
    }
    setModalVisible(false);
  };

  const handleTimeChange = (text) => {
    if (/^\d{1,2}:\d{0,2}$/.test(text)) {
      const formattedText = text.length === 4 ? `0${text}` : text;
      const updatedSchedule = [...schedule];
      updatedSchedule[selectedRow].time = formattedText;
      setSchedule(updatedSchedule);
    }
  };

  const handleSelectDate = (day) => {
    setSelectedDates((prevDates) =>
      prevDates.includes(day) ? prevDates.filter((date) => date !== day) : [...prevDates, day]
    );
  };

  const handleCalendarPress = () => {
    console.log("Calendar pressed");
  };
  const handleAddPress = () => {
    console.log("Add pressed");
  };
  const handleViewPress = () => {
    console.log("View pressed");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Medications</Text>

      <TextInput
        style={styles.input}
        placeholder="Medication Name"
        value={medicationName}
        onChangeText={setMedicationName}
      />

      <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
        <Text style={styles.inputText}>{frequency}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Frequency</Text>
            <TouchableOpacity onPress={() => handleSelectFrequency('Every day')}>
              <Text style={styles.modalOption}>Every day</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectFrequency('Every x days')}>
              <Text style={styles.modalOption}>Every x days</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectFrequency('Day of the week')}>
              <Text style={styles.modalOption}>Day of the week</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectFrequency('Day of the month')}>
              <Text style={styles.modalOption}>Day of the month</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {frequency === 'Day of the week' && (
        <View style={styles.checkboxContainer}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <TouchableOpacity
              key={day}
              style={styles.checkboxItem}
              onPress={() =>
                setSelectedDays((prevState) => ({
                  ...prevState,
                  [day]: !prevState[day],
                }))
              }
            >
              <Text style={styles.checkboxLabel}>{day}</Text>
              {selectedDays[day] && <Text style={styles.checkboxChecked}>✔</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {frequency === 'Day of the month' && (
        <View style={styles.checkboxContainer}>
          {[...Array(31).keys()].map((num) => (
            <TouchableOpacity
              key={num + 1}
              style={styles.checkboxItem}
              onPress={() => handleSelectDate(num + 1)}
            >
              <Text style={styles.checkboxLabel}>{num + 1}</Text>
              {selectedDates.includes(num + 1) && <Text style={styles.checkboxChecked}>✔</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {frequency === 'Every x days' && (
        <TextInput
          style={styles.input}
          placeholder="Enter the number of x days you want to repeat"
          keyboardType="numeric"
          value={count}
          onChangeText={setCount}
        />
      )}

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Time</Text>
          <Text style={styles.tableHeader}>Dosage</Text>
          <Text style={styles.tableHeader}>Action</Text>
        </View>

        <FlatList
          data={schedule}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.tableRow}>
              <TouchableOpacity onPress={() => handleEditRow(index)}>
                <Text style={styles.tableCell}>{item.time}</Text>
              </TouchableOpacity>
              <Text style={styles.tableCell}>{item.dosage}</Text>
              <TouchableOpacity onPress={() => handleDelete(index)}>
                <Text style={styles.deleteBtn}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {editMode && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="Time"
            value={schedule[selectedRow].time}
            onChangeText={handleTimeChange}
          />
          <TextInput
            style={styles.input}
            placeholder="Dosage"
            value={schedule[selectedRow].dosage}
            onChangeText={(text) => {
              const updatedSchedule = [...schedule];
              updatedSchedule[selectedRow].dosage = text;
              setSchedule(updatedSchedule);
            }}
          />
          <Button title="Save" onPress={handleSaveRow} />
        </View>
      )}

      <Button title="Add Medication" onPress={handleAddMedication} style={styles.addMedicationButton} />

      <MedicalFooter
        onCalendarPress={handleCalendarPress}
        onAddPress={handleAddPress}
        onViewPress={handleViewPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
    marginTop: 20,
  },
  text: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
  table: {
    width: '100%',
    marginBottom: 20,
    flexGrow: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    width: '30%',
  },
  tableCell: {
    textAlign: 'center',
  },
  deleteBtn: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editContainer: {
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOption: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  modalClose: {
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
  },
  addMedicationButton: {
    marginBottom: 50,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    marginRight: 5,
  },
  checkboxChecked: {
    fontSize: 18,
    color: 'green',
  },
});

export default Medications;

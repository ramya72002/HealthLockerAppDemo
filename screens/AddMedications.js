import React, { useState ,useEffect} from 'react';
import { Text, View, TextInput, Button, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Import the date picker modal
import MedicalFooter from '../components/MedicalFooter'; // Import the footer
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CalendarView from './CalendarView';
import { useNavigation } from '@react-navigation/native'; // useNavigation hook

const Medications = () => {
  const navigation = useNavigation(); // useNavigation hook

  const [medicationName, setMedicationName] = useState('');
  const [frequency, setFrequency] = useState('Every day');
  const [count, setCount] = useState('');
  const [userId, setUserId] = useState(''); // Use TypeScript's string type for state
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
  const [endDate, setEndDate] = useState(''); // Add state for end date
  const [startDate, setStartDate] = useState(''); // Add state for start date
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false); // Add state for start date picker visibility

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userDetails = await AsyncStorage.getItem('userDetails');
        if (userDetails) {
          const parsedDetails = JSON.parse(userDetails); // Parse the stored JSON string
          if (parsedDetails && parsedDetails.user_id) {
            setUserId(parsedDetails.user_id); // Assuming 'user_id' is the property to display
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchUserId();
  }, []); 
const handleAddMedication = async () => {
  let selectedDaysString = '';
  if (frequency === 'Day of the week') {
    selectedDaysString = Object.keys(selectedDays)
      .filter(day => selectedDays[day])
      .join(', ');
  }

  let selectedDatesString = '';
  if (frequency === 'Day of the month') {
    selectedDatesString = selectedDates.join(', ');
  }

  const medicationData = {
    user_id: userId, // Replace with the actual user ID
    image_urls: [], // Include URLs of related images if required
    medication_name: medicationName,
    frequency: frequency,
    date_time: new Date().toISOString(),
    schedule: JSON.stringify(schedule),
    start_date: startDate,
    end_date: endDate,
    count: frequency === 'Every x days' ? count : null,
    selected_days: frequency === 'Day of the week' ? selectedDaysString : null,
    selected_dates: frequency === 'Day of the month' ? selectedDatesString : null,
  };

  console.log('Medication Added:', medicationData);

  try {
    const response = await axios.post('https://health-project-backend-url.vercel.app/medications_wrt_userId', medicationData);

    if (response.data.success) {
      console.log('Medication saved successfully:', response.data);
      alert('Medication added successfully!');
      navigation.navigate("CalendarView");

    } else {
      console.error('Failed to save medication:', response.data.message);
      alert('Failed to add medication. Please try again.');
    }
  } catch (error) {
    console.error('Error while saving medication:', error);
    alert('An error occurred while adding the medication.');
  }
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

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisible(true); // Show the start date picker
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisible(false);
  };

  const handleConfirmDate = (date) => {
    setEndDate(date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
    hideDatePicker();
  };

  const handleConfirmStartDate = (date) => {
    setStartDate(date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
    hideStartDatePicker();
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
<TouchableOpacity style={styles.input} onPress={showStartDatePicker}>
        <Text style={styles.inputText}>{startDate || 'Select Start Date'}</Text>
      </TouchableOpacity>

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
      
      {/* Date picker for End Date */}
      <TouchableOpacity style={styles.input} onPress={showDatePicker}>
        <Text style={styles.inputText}>{endDate || 'Select End Date'}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />

      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmStartDate}
        onCancel={hideStartDatePicker}
      />

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

      <Button title="Add Medication" onPress={handleAddMedication} />
      
      <MedicalFooter />
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
    fontSize: 18,
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
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOption: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  modalClose: {
    fontSize: 14,
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
    fontSize: 14,
    marginRight: 5,
  },
  checkboxChecked: {
    fontSize: 14,
    color: 'green',
  },
});

export default Medications;

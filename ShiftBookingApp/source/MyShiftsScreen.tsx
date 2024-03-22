import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const MyShiftsScreen = () => {
  const [bookedShifts, setBookedShifts] = useState([]);

  useEffect(() => {
    fetchBookedShifts();
  }, []);

  const fetchBookedShifts = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8080/shifts');
      setBookedShifts(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching booked shifts:', error);
    }
  };

  const renderShiftItem = ({ item }) => {
    const { startTime, endTime, area } = item;
    const startTimeString = new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTimeString = new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const amPmStartTime = startTimeString.slice(-2);
    const amPmEndTime = endTimeString.slice(-2);
  
    return (
      <View style={styles.shiftItem}>
        <Text style={styles.dateText}>
          {formatDate(new Date(startTime))}
        </Text>
        <View style={styles.shiftContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {startTimeString.slice(0, -3)} - {endTimeString.slice(0, -3)}
            </Text>
            <Text style={styles.amPmText}>{amPmStartTime} - {amPmEndTime}</Text>
          </View>
          <Text style={styles.areaText}>{area}</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item.id)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const formatDate = (date) => {
    const monthName = date.toLocaleString('default', { month: 'long' });
    return `${monthName} ${date.getDate()}`;
  };

  const handleCancel = (id) => {
    // Filter out the canceled shift from the booked shifts
    const updatedShifts = bookedShifts.filter(shift => shift.id !== id);
    setBookedShifts(updatedShifts);
    console.log('Cancel booking:', id);
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        data={bookedShifts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderShiftItem}
        ListEmptyComponent={() => (
          <Text style={styles.noShiftsText}>No Booked Shifts</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amPmText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  shiftItem: {
    marginBottom: 10,
  },
  shiftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  areaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#E2006A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#E2006A',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noShiftsText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      timeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
          },
});


export default MyShiftsScreen;

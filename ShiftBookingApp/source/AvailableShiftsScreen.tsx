import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const AvailableShiftsScreen = () => {
  const [shifts, setShifts] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [shiftCounts, setShiftCounts] = useState({});
  const [bookedShifts, setBookedShifts] = useState([]);

  useEffect(() => {
    axios.get('http://10.0.2.2:8080/shifts')
      .then(response => {
        const shiftsData = response.data;
        setShifts(shiftsData);
        const counts = {};
        shiftsData.forEach(shift => {
          counts[shift.area] = counts[shift.area] ? counts[shift.area] + 1 : 1;
        });
        setShiftCounts(counts);
      })
      .catch(error => {
        console.error('Error fetching shifts:', error);
      });
  }, []);

  useEffect(() => {
    filterShifts();
  }, [selectedCity, shifts]);

  const filterShifts = () => {
    let filtered = shifts.filter(shift => shift.area === selectedCity && !checkForOverlap(shift));
    if (selectedCity === '') {
      filtered = shifts.filter(shift => !checkForOverlap(shift));
    }
    const groupedShifts = groupShiftsByDateAndMonth(filtered);

    const groupedShiftsArray = Object.entries(groupedShifts).map(([key, value]) => ({
      date: key,
      shifts: value,
    }));

    setFilteredShifts(groupedShiftsArray);
  };

  const groupShiftsByDateAndMonth = (shifts) => {
    const groupedShifts = {};
    shifts.forEach(shift => {
      const date = new Date(shift.startTime);
      const monthName = date.toLocaleString('default', { month: 'long' });
      const formattedDate = `${monthName} ${date.getDate()}`;
      const key = `${formattedDate}`;
      if (!groupedShifts[key]) {
        groupedShifts[key] = [];
      }
      groupedShifts[key].push(shift);
    });
    return groupedShifts;
  };

  const checkForOverlap = (currentShift) => {
    return shifts.some(shift => {
      return shift.id !== currentShift.id &&
        shift.area === currentShift.area &&
        (currentShift.startTime >= shift.startTime && currentShift.startTime < shift.endTime ||
          currentShift.endTime > shift.startTime && currentShift.endTime <= shift.endTime);
    });
  };

  const handleBooking = (id, isBooked) => {
    const updatedShifts = shifts.map(shift => {
      if (shift.id === id) {
        return { ...shift, booked: !isBooked };
      }
      return shift;
    });
    setShifts(updatedShifts);
    if (isBooked) {
      setBookedShifts(prevBookedShifts => prevBookedShifts.filter(shift => shift.id !== id));
    } else {
      const bookedShift = shifts.find(shift => shift.id === id);
      setBookedShifts(prevBookedShifts => [...prevBookedShifts, bookedShift]);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {Object.entries(shiftCounts).map(([area, count]) => (
          <TouchableOpacity
            key={area}
            style={styles.navItem}
            onPress={() => setSelectedCity(area)}
          >
            <Text>{area} ({String(count)})</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredShifts}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <View style={styles.shiftContainer}>
            <Text style={styles.dateText}>{item.date}</Text>
            {item.shifts.map(shift => (
              <View key={shift.id} style={styles.shiftItem}>
                <Text style={styles.timeText}>
                  {new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(shift.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {shift.booked ? (
                                    <View style={styles.bookedContainer}>
                    <Text style={styles.bookedText}>Booked</Text>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleBooking(shift.id, shift.booked)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => handleBooking(shift.id, shift.booked)}
                  >
                    <Text style={styles.ButtonText}>Book</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
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
  shiftContainer: {
    marginBottom: 20,
  },
  ButtonText: {
    color: '#16A64D',
    fontSize: 14,
    fontWeight: 'bold',
  },
  shiftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  bookedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookedText: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  bookButton: {
    borderWidth: 2,
    borderColor: '#16A64D',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  navItem: {
    paddingVertical: 10,
  },
});

export default AvailableShiftsScreen;


import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const getWeeklyReport = (orders, startDate, endDate) => {
    const weeklyData = {};
    const start = moment(startDate).startOf('day');
    const end = moment(endDate).endOf('day');

    let currentWeekStart = moment(start).startOf('isoWeek');
    while (currentWeekStart.isSameOrBefore(end)) {
        const weekKey = currentWeekStart.format('YYYY-MM-DD');
        weeklyData[weekKey] = {
            totalOrders: 0,
            completedOrders: 0,
            cancelledOrders: 0,
            pendingOrders: 0,
            totalRevenue: 0,
            weekLabel: `Semana ${currentWeekStart.format('DD/MM')} - ${moment(currentWeekStart).endOf('isoWeek').format('DD/MM')}`
        };
        currentWeekStart.add(1, 'week');
    }

    orders.forEach(order => {
        const orderDate = moment(order.createdAt);

        if (orderDate.isBetween(start, end, null, '[]')) { 
            const weekKey = orderDate.startOf('isoWeek').format('YYYY-MM-DD');
            
            if (weeklyData[weekKey]) {
                weeklyData[weekKey].totalOrders += 1;
                weeklyData[weekKey].totalRevenue += parseFloat(order.deliveryCost || 0);

                switch (order.status) {
                    case 'Completada':
                        weeklyData[weekKey].completedOrders += 1;
                        break;
                    case 'Cancelada':
                        weeklyData[weekKey].cancelledOrders += 1;
                        break;
                    case 'Pendiente':
                    case 'Asignada':
                    case 'En camino':
                        weeklyData[weekKey].pendingOrders += 1;
                        break;
                }
            }
        }
    });

    return Object.values(weeklyData).sort((a, b) => moment(a.weekLabel.split(' ')[1], 'DD/MM').valueOf() - moment(b.weekLabel.split(' ')[1], 'DD/MM').valueOf());
};

export default function AdminReportsScreen() {
    const allOrders = useSelector(state => state.orders.list);

    const defaultEndDate = moment().toDate();
    const defaultStartDate = moment().subtract(4, 'weeks').startOf('isoWeek').toDate(); 

    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const calculateDeliveryAverage = () => {
        const completedOrdersWithTime = allOrders.filter(order => {
            const orderDate = moment(order.createdAt);
            const isInRange = orderDate.isBetween(moment(startDate).startOf('day'), moment(endDate).endOf('day'), null, '[]');
            
            return isInRange && order.status === 'Completada' && order.pickupTime && order.deliveredTime;
        });

        if (completedOrdersWithTime.length === 0) return "N/A";

        let totalMinutes = 0;
        completedOrdersWithTime.forEach(order => {
            const start = moment(order.pickupTime);
            const end = moment(order.deliveredTime);
            const duration = end.diff(start, 'minutes');
            if (duration > 0) totalMinutes += duration;
        });

        const averageMinutes = Math.round(totalMinutes / completedOrdersWithTime.length);
        
        if (averageMinutes >= 60) {
            const hours = Math.floor(averageMinutes / 60);
            const mins = averageMinutes % 60;
            return `${hours}h ${mins}min`;
        }
        return `${averageMinutes} min`;
    };

    const averageDeliveryTime = useMemo(() => calculateDeliveryAverage(), [allOrders, startDate, endDate]);

    const weeklyReport = useMemo(() => {
        return getWeeklyReport(allOrders, startDate, endDate);
    }, [allOrders, startDate, endDate]);


    const handleDateChange = (event, selectedDate, type) => {
        if (Platform.OS === 'android') {
            type === 'start' ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
        }

        if (selectedDate) {
            if (type === 'start') {
                if (moment(selectedDate).isAfter(endDate)) {
                    Alert.alert('Error', 'La fecha de inicio no puede ser posterior a la fecha final');
                } else {
                    setStartDate(selectedDate);
                }
            } else {
                if (moment(selectedDate).isBefore(startDate)) {
                    Alert.alert('Error', 'La fecha final no puede ser anterior a la fecha de inicio');
                } else {
                    setEndDate(selectedDate);
                }
            }
        }
    };
    
    const totalOrders = weeklyReport.reduce((sum, w) => sum + w.totalOrders, 0);
    const totalCompleted = weeklyReport.reduce((sum, w) => sum + w.completedOrders, 0);
    const totalRevenue = weeklyReport.reduce((sum, w) => sum + w.totalRevenue, 0);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <Text style={styles.header}>Resumen de reportes</Text>
                
                <View style={styles.filterSection}>
                    <Text style={styles.sectionTitle}>Filtro de rango de fechas</Text>
                    
                    <View style={styles.datePickerRow}>
                        
                        <View style={styles.dateInputContainer}>
                            <Text style={styles.label}>Inicio:</Text>
                            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateInput}>
                                <Text>{moment(startDate).format('DD/MM/YYYY')}</Text>
                            </TouchableOpacity>
                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    display="default"
                                    maximumDate={new Date()}
                                    onChange={(e, d) => handleDateChange(e, d, 'start')}
                                />
                            )}
                        </View>

                        <View style={styles.dateInputContainer}>
                            <Text style={styles.label}>Final:</Text>
                            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateInput}>
                                <Text>{moment(endDate).format('DD/MM/YYYY')}</Text>
                            </TouchableOpacity>
                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={endDate}
                                    mode="date"
                                    display="default"
                                    maximumDate={new Date()}
                                    onChange={(e, d) => handleDateChange(e, d, 'end')}
                                />
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.separator} />
                
                <Text style={styles.sectionTitle}>Indicadores clave del período</Text>
                <View style={styles.kpiContainer}>
                    <View style={styles.kpiCard}>
                        <Text style={styles.kpiValue}>{totalOrders}</Text>
                        <Text style={styles.kpiLabel}>Órdenes totales</Text>
                    </View>
                    <View style={styles.kpiCard}>
                        <Text style={styles.kpiValue}>{totalCompleted}</Text>
                        <Text style={styles.kpiLabel}>Órdenes completadas</Text>
                    </View>
                </View>
                <View style={styles.kpiContainer}>
                    <View style={styles.kpiCard}>
                        <Text style={styles.kpiValueRevenue}>${totalRevenue.toFixed(2)}</Text>
                        <Text style={styles.kpiLabel}>Ingreso delivery (Est.)</Text>
                    </View>
                    
                    <View style={styles.kpiCard}>
                        <Text style={styles.kpiValueAverage}>{averageDeliveryTime}</Text>
                        <Text style={styles.kpiLabel}>Promedio tiempo de entrega</Text>
                        <Text style={styles.kpiSubLabel}>(Recolección ➔ Entrega)</Text>
                    </View>

                </View>

                <View style={styles.separator} />
                
                <Text style={styles.sectionTitle}>Resumen de órdenes semanal</Text>
                
                {weeklyReport.length === 0 ? (
                    <Text style={styles.emptyText}>No hay datos en el rango seleccionado</Text>
                ) : (
                    weeklyReport.map((week, index) => (
                        <View key={index} style={styles.weekCard}>
                            <Text style={styles.weekTitle}>{week.weekLabel}</Text>
                            <View style={styles.weekDetailRow}>
                                <Text style={styles.weekDetailLabel}>Total de órdenes:</Text>
                                <Text style={styles.weekDetailValueTotal}>{week.totalOrders}</Text>
                            </View>
                            <View style={styles.weekDetailRow}>
                                <Text style={styles.weekDetailLabel}>Completadas:</Text>
                                <Text style={styles.weekDetailValueCompleted}>{week.completedOrders}</Text>
                            </View>
                            <View style={styles.weekDetailRow}>
                                <Text style={styles.weekDetailLabel}>Canceladas:</Text>
                                <Text style={styles.weekDetailValueCancelled}>{week.cancelledOrders}</Text>
                            </View>
                            <View style={styles.weekDetailRow}>
                                <Text style={styles.weekDetailLabel}>Pendientes/Asignadas:</Text>
                                <Text style={styles.weekDetailValuePending}>{week.pendingOrders}</Text>
                            </View>
                            <View style={styles.weekDetailRow}>
                                <Text style={styles.weekDetailLabel}>Ingreso estimado:</Text>
                                <Text style={styles.weekDetailValueRevenue}>${week.totalRevenue.toFixed(2)}</Text>
                            </View>
                        </View>
                    ))
                )}
                
            </ScrollView>

            <TouchableOpacity style={styles.downloadButton} disabled={true}>
                <Text style={styles.downloadButtonText}>Descargar reporte (Futuro)</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    scrollContent: { 
        padding: 15, 
        paddingBottom: 100 
    },
    separator: { 
        height: 1, 
        backgroundColor: '#ddd', 
        marginVertical: 20 
    },
    emptyText: { 
        textAlign: 'center', 
        color: '#888', 
        marginTop: 20 
    },
    header: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: 15, 
        textAlign: 'center' 
    },
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#00A89C', 
        marginBottom: 10 
    },
    filterSection: { 
        padding: 10, 
        backgroundColor: 'white', 
        borderRadius: 10, 
        elevation: 1 
    },
    datePickerRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    dateInputContainer: { 
        flex: 1, 
        marginHorizontal: 5 
    },
    label: { 
        fontSize: 14, 
        color: '#555', 
        marginBottom: 5, 
        fontWeight: 'bold' 
    },
    dateInput: {
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 8, 
        padding: 10,
        backgroundColor: '#fff', 
        alignItems: 'center',
    },
    kpiContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 15 
    },
    kpiCard: {
        flex: 1, 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 10, 
        marginHorizontal: 5,
        alignItems: 'center', 
        elevation: 2,
    },
    kpiValue: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#FF7F00' 
    },
    kpiValueRevenue: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#00A89C' 
    },
    kpiLabel: { 
        fontSize: 14, 
        color: '#555', 
        marginTop: 5, 
        textAlign: 'center' 
    },
    kpiValueAverage: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: '#333' 
    }, 
    kpiSubLabel: { 
        fontSize: 10, 
        color: '#999', 
        marginTop: 2 
    },
    kpiCardPlaceholder: {
        flex: 1, 
        backgroundColor: '#eee', 
        padding: 15, 
        borderRadius: 10, 
        marginHorizontal: 5,
        alignItems: 'center', 
        justifyContent: 'center', 
        elevation: 2,
    },
    kpiPlaceholderText: { 
        fontSize: 14, 
        color: '#888', 
        textAlign: 'center', 
        marginBottom: 5 
    },
    kpiPlaceholderValue: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: '#888' 
    },
    kpiPlaceholderSubtext: { 
        fontSize: 12, 
        color: '#888', 
        marginTop: 3 
    },
    weekCard: {
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10,
        elevation: 1,
    },
    weekTitle: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee', 
        paddingBottom: 5 
    },
    weekDetailRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingVertical: 3 
    },
    weekDetailLabel: { 
        fontSize: 14, 
        color: '#555' 
    },
    weekDetailValueTotal: { 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    weekDetailValueCompleted: { 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#00A89C' 
    },
    weekDetailValueCancelled: { 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#d9534f' 
    },
    weekDetailValuePending: { 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#FF7F00' 
    },
    weekDetailValueRevenue: { 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#00A89C' 
    },
    downloadButton: {
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0,
        backgroundColor: '#ccc',
        paddingVertical: 15, 
        alignItems: 'center',
    },
    downloadButtonText: { 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 16 
    },
});
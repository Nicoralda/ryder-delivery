import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/es';
import { Ionicons } from '@expo/vector-icons';

moment.locale('es');

const getMonthOptions = (numMonths = 6) => {
    const options = [];
    let date = moment();
    for (let i = 0; i < numMonths; i++) {
        options.push({
            label: date.format('MMMM YYYY'),
            value: date.format('YYYY-MM')
        });
        date.subtract(1, 'month');
    }
    return options;
};

const MONTH_OPTIONS = getMonthOptions(6);

export default function RyderHistoryScreen() {
    const currentRiderId = 'R001'; 

    const allOrders = useSelector(state => state.orders.list);
    const [selectedMonth, setSelectedMonth] = useState(MONTH_OPTIONS[0].value);

    const { totalEarnings, avgDeliveryTime, deliveryCount } = useMemo(() => {
        const completedRiderOrders = allOrders.filter(order => 
            order.riderId === currentRiderId && 
            order.status === 'Completada'
        );

        const filteredOrders = completedRiderOrders.filter(order => 
            moment(order.deliveryTime).format('YYYY-MM') === selectedMonth
        );

        let totalEarnings = 0;
        let totalDurationSeconds = 0;

        filteredOrders.forEach(order => {
            if (order.fee) {
                totalEarnings += order.fee;
            }

            if (order.pickupTime && order.deliveryTime) {
                const start = moment(order.pickupTime);
                const end = moment(order.deliveryTime);
                const duration = end.diff(start, 'seconds');
                totalDurationSeconds += duration;
            }
        });

        const deliveryCount = filteredOrders.length;
        let avgDeliveryTime = 'N/A';
        
        if (deliveryCount > 0 && totalDurationSeconds > 0) {
            const avgDurationSeconds = totalDurationSeconds / deliveryCount;
            const minutes = Math.floor(avgDurationSeconds / 60);
            const seconds = Math.round(avgDurationSeconds % 60);
            avgDeliveryTime = `${minutes} min, ${seconds} seg`;
        }

        return {
            totalEarnings: totalEarnings.toFixed(2),
            avgDeliveryTime,
            deliveryCount
        };
    }, [allOrders, selectedMonth, currentRiderId]);

    const formatCurrency = (amount) => {
        return `$${amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.screenTitle}>Mi historial de entregas</Text>

            <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Mes a analizar:</Text>
                <View style={styles.monthSelector}>
                    {MONTH_OPTIONS.map((month, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.monthButton,
                                selectedMonth === month.value && styles.activeMonthButton,
                            ]}
                            onPress={() => setSelectedMonth(month.value)}
                        >
                            <Text style={[
                                styles.monthText, 
                                selectedMonth === month.value && styles.activeMonthText
                            ]}>
                                {month.label.split(' ')[0]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.currentSelection}>
                    Mostrando datos de: {MONTH_OPTIONS.find(m => m.value === selectedMonth)?.label}
                </Text>
            </View>

            <View style={styles.metricsContainer}>
                <MetricCard 
                    title="Entregas completadas"
                    value={deliveryCount}
                    unit="pedidos"
                    icon="checkmark-circle-outline"
                    color="#00A89C"
                />
                <MetricCard 
                    title="Ganancia total del mes"
                    value={formatCurrency(totalEarnings)}
                    unit="COP / USD (Simulado)"
                    icon="cash-outline"
                    color="#FF7F00"
                />
                <MetricCard 
                    title="Tiempo de entrega promedio"
                    value={avgDeliveryTime}
                    unit="tiempo total"
                    icon="timer-outline"
                    color="#0d6efd"
                />
            </View>

            {deliveryCount === 0 && (
                 <Text style={styles.emptyText}>
                    Aún no tienes órdenes completadas en {MONTH_OPTIONS.find(m => m.value === selectedMonth)?.label}.
                 </Text>
            )}
        </ScrollView>
    );
}

const MetricCard = ({ title, value, unit, icon, color }) => (
    <View style={styles.metricCard}>
        <Ionicons name={icon} size={30} color={color} style={{ marginBottom: 5 }} />
        <Text style={styles.metricTitle}>{title}</Text>
        <Text style={[styles.metricValue, { color }]}>{value}</Text>
        <Text style={styles.metricUnit}>{unit}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5', 
    },
    screenTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: 20 
    },
    filterContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 2,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    monthSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    monthButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: '#eee',
    },
    activeMonthButton: {
        backgroundColor: '#FF7F00',
    },
    monthText: {
        color: '#333',
        fontSize: 14,
        textTransform: 'capitalize',
    },
    activeMonthText: {
        color: 'white',
        fontWeight: 'bold',
    },
    currentSelection: {
        marginTop: 10,
        fontSize: 14,
        color: '#666',
        textAlign: 'center'
    },
    metricsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    metricCard: {
        width: '48%',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 2,
        alignItems: 'center',
    },
    metricTitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
    },
    metricUnit: {
        fontSize: 10,
        color: '#999',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
        color: '#999',
        paddingHorizontal: 20
    }
});
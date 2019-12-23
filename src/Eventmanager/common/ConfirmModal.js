import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { CardItem } from './CardItem';

const ConfirmModal = ({ visible, event, onBackButtonPress, onBackdrop, onSwipe, onAccept, onDecline, todo }) => {

    return (
        <Modal
            isVisible={visible}
            onBackButtonPress={onBackButtonPress}
            onBackdropPress={onBackdrop}
            onSwipe={onSwipe}
            swipeDirection='down'
            style={styles.bottomModal}
        >
            <View style={styles.containerStyle}>
                <Text style={{ fontSize: 21, color: 'black', marginBottom: -10 }}>Event {todo}</Text>
                <Text>_________________________________</Text>
                <CardItem style={styles.cardSectionStyle}>
                    <Text style={styles.textStyle}>
                        Bist du dir sicher, dass du <Text style={{ fontWeight: 'bold' }}>{event}</Text> {todo} willst?
                    </Text>
                </CardItem>
                <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
                    <TouchableOpacity style={{ paddingLeft: 50, paddingRight: 50 }} onPress={onAccept}>
                        <Text style={{ color: 'green', fontSize: 20 }}>Ja</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingLeft: 50, paddingRight: 50 }} onPress={onDecline}>
                        <Text style={{ color: 'red', fontSize: 20 }}>Nein</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = {
    cardSectionStyle: {
        justifyContent: 'center'
    },
    textStyle: {
        flex: 1,
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 40,
        color: 'black'
    },
    containerStyle: {
        backgroundColor: 'white',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        height: 200
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0
    }
};

export { ConfirmModal };

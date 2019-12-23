import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { CardItem } from './CardItem';

class NotificationModal extends Component {

    renderNotificationItems() {
        return this.props.items.map((event) =>
            <Text key={event.id} style={styles.itemStyle}>Event: {event.name}</Text>
        );
    }

    render() {
        return (
            <Modal
                isVisible={this.props.visible}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
                onBackButtonPress={this.props.onBackButtonPress}
                onBackdropPress={this.props.onBackdrop}
            >
                <View style={styles.containerStyle}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon
                            name="md-bulb"
                            size={22.5}
                            color='rgba(0, 177, 94, 0.7)'
                        />
                        <Text style={{ fontSize: 18, color: 'black', marginLeft: 5, marginBottom: -5 }}>Neue Benachrichtigung</Text>
                    </View>
                    <Text>___________________________________</Text>

                    <CardItem style={styles.cardSectionStyle}>
                        <Text style={styles.textStyle}>
                            Du wurdest in folgende Events eingeladen:
                        </Text>
                    </CardItem>

                    <View>
                        {this.renderNotificationItems()}
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={{ paddingLeft: 50, paddingRight: 50, marginTop: 20 }} onPress={this.props.onConfirm}>
                            <Text style={{ color: 'black', fontSize: 20 }}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = {
    cardSectionStyle: {
        justifyContent: 'center'
    },
    textStyle: {
        flex: 1,
        fontSize: 16,
        textAlign: 'center',
        color: 'black'
    },
    containerStyle: {
        backgroundColor: 'white',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        height: 250,
        marginTop: 30
    },
    itemContainerStyle: {
        alignItems: 'center'
    },
    itemStyle: {
        color: 'rgba(0,0,0,0.9)',
        fontSize: 15,
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10
    }
};

export { NotificationModal };

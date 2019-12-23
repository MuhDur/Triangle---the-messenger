import React, { Component } from 'react';
import { ScrollView, View, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Realm from 'realm';
import { ConfirmModal, NotificationModal } from '../common';
import ManagerEvents from './ManagerEvents';
import UserEvents from './UserEvents';
//import { UserData } from '../GlobalUserData';

//const USERID = UserData.USERID;

const UserSchema = {
  name: 'userdata',
  primaryKey: 'id',
  properties: {
    id:    'int',    // primary key
    username: 'string',
    password: 'string',
    userid: 'int',
  }
};

const MessageSchema = {
  name: 'messages',
  primaryKey: 'id',
  properties: {
    id:    'int',    // primary key
    text: 'string',
    creatorid: 'int',
    recipientid: 'int',
    recipient_group_id: 'int',
    createdAt: 'string',
    datatype: 'int',
    creatorname: 'string',
    recipientname: 'string'
  }
};

class EventList extends Component {

    state = {
        refreshing: false,
        managerevents: [],
        userid: '',
        userevents: [],
        showModal: false,
        modalEventName: '',
        modalEvent: {},
        showNotificationModal: false,
        notificationEvents: []
    };

    componentWillMount() {
      // realm
      Realm.open({
        schema: [MessageSchema,UserSchema]
      }).then(realm => {
        let result = realm.objects('userdata');
        this.setState({ userid: result[0].userid }, () => { // state gleich gesetzt
        });
      }).then(() => {
        this.fetchMyManagerEvents();
        this.fetchMyUserEvents();
      });

    }


    componentWillReceiveProps(nextProps) {
        const i = nextProps.refresh.refresh;
        setTimeout(() => {
          this.fetchMyUserEvents();
          this.fetchMyManagerEvents();
        }, 500);


    }           // nachdem Event verlassen, oder Event erstellt -> update UI


    onRefresh() {
        this.setState({ refreshing: true });
        this.fetchMyManagerEvents();
        this.fetchMyUserEvents();
        this.setState({ refreshing: false });
    }

    fetchMyManagerEvents = () => {
        fetch('http://triangle.bulme.at/~pi/EveAPI/EventList/showeventsmanager.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: this.state.userid
            })
        }).then((response) => response.json())
            .then((responseData) => {
                this.setState({ managerevents: responseData });
            });
    }

    fetchMyUserEvents = () => {
        let notificateEvent = [];
        fetch('http://triangle.bulme.at/~pi/EveAPI/EventList/showeventsuseronly.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: this.state.userid
            })
        }).then((response) => response.json())
            .then((responseData) => {
                this.setState({ userevents: responseData });
            }).then(() => {
            // notificate
            for (let i = 0; i < this.state.userevents.length; i++) {
                if (this.state.userevents[i].notification === '0') {            // nur wenn er nicht gesehen hat
                    const notificateObject = {
                        id: this.state.userevents[i].id,
                        name: this.state.userevents[i].name
                    };
                    notificateEvent = notificateEvent.concat(notificateObject);
                }
            }

            if (notificateEvent.length !== 0) {
                this.notificateUser(notificateEvent);
            }
        });
    }

    notificateUser(notificateEvent) {                 // toggle notification modal
        this.setState({ showNotificationModal: true, notificationEvents: notificateEvent });
    }

    onConfirmNotification = () => {
        for (let i = 0; i < this.state.notificationEvents.length; i++) {
            fetch('http://triangle.bulme.at/~pi/EveAPI/EventList/confirmnotification.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: this.state.userid,
                    eventid: this.state.notificationEvents[i].id               // event.id
                })
            });
        }
        this.setState({ showNotificationModal: false });
    }

    onIconPress = () => {
        // delete event
        // fetch
        // erst wenn onAccept bei Modal geglückt hat
        fetch('http://triangle.bulme.at/~pi/EveAPI/EventList/deleteevent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventid: this.state.modalEvent.id               // event.id
            })
        })
            .then(() => {
            // refresh
            this.fetchMyManagerEvents();
            this.fetchMyUserEvents();
            this.setState({ showModal: false });
        });
    }

    renderManagerEvents() {
        return this.state.managerevents.map(event =>
            <ManagerEvents
                key={event.id}
                event={event}
                onPress={() => Actions.eventvote({ event })}
                onIconPress={() => this.toggleModal(event)}
            />
        );
    }

    renderUserEvents() {
        return this.state.userevents.map(event =>
            <UserEvents
              key={event.id}
              event={event}
              onPress={() => Actions.eventvote({ event })}
            />
        );
    }

    toggleModal(event) {
        this.setState({ showModal: !this.state.showModal, modalEvent: event, modalEventName: event.name });
    }

    renderConditionalContent = () => {
        if (this.state.userevents.length === 0 && this.state.managerevents.length === 0) {
            return (
              <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 18, color: 'black' }}>
                Du hast noch keine Events..
              </Text>
            );
        }

        return (
            <View>
                <View>
                    {this.renderManagerEvents()}
                </View>

                <View>
                    {this.renderUserEvents()}
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />}
                >
                    {this.renderConditionalContent()}
                </ScrollView>

                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.buttonStyle}
                  onPress={() => Actions.eventform()}
                >
                    <Icon name="md-add" size={30} color="white" />
                </TouchableOpacity>

                <ConfirmModal
                    visible={this.state.showModal}
                    event={this.state.modalEventName}
                    onBackButtonPress={() => this.setState({ showModal: false })}
                    onBackdrop={() => this.setState({ showModal: false })}
                    onSwipe={() => this.setState({ showModal: false })}
                    onAccept={this.onIconPress}
                    onDecline={() => this.setState({ showModal: false })}
                    todo="löschen"
                />

                <NotificationModal
                    visible={this.state.showNotificationModal}
                    items={this.state.notificationEvents}
                    onBackButtonPress={() => this.setState({ showNotificationModal: false })}
                    onBackdrop={() => this.setState({ showNotificationModal: false })}
                    onConfirm={this.onConfirmNotification}
                />

            </View>
        );
    }
}

const styles = {
    buttonStyle: {
        bottom: 30,
        right: 40,
        width: 50,
        height: 50,
        position: 'absolute',
        borderRadius: 25,
        backgroundColor: '#00B15E',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1
    },
    notification: {
        position: 'absolute',
        paddingHorizontal: 7,
        paddingVertical: 15,
        left: 0,
        top: 0,
        right: 0,
        backgroundColor: 'tomato'
    },
    notificationText: {
        color: '#FFF'
    }
};

export default EventList;

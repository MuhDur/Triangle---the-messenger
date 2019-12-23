import React, { Component } from 'react';
import { ScrollView, View, Text, Picker, Alert, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Card, CardItem, CheckBox } from 'native-base';
import { Button } from 'react-native-elements';
import AButton from 'react-native-micro-animated-button';
import 'whatwg-fetch';
import DateTimePicker from 'react-native-modal-datetime-picker';
import RNGooglePlaces from 'react-native-google-places';
import moment from 'moment';
import Realm from 'realm';
import { FormInput } from '../common';
import DatePicked from './DatePicked';
import FriendPicked from './FriendPicked';
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

class EventForm extends Component {
    state = {
        name: '',
        anlass: '',
        typ: '',
        managerid: '',
        userid: '',
        singleChecked: false,
        multiChecked: false,
        isDTPickerVisible: false,
        datetime: moment(),
        dates: [],
        mysqldates: [],
        eventfriends: [],
        selectedFPickerValue: '',
        friends: [],
        disableButton: false,
        placePicked: 'Ort wählen',
        placeDataPicked: {}
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
        fetch('http://triangle.bulme.at/~pi/EveAPI/EventForm/fetchuserfriends.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: this.state.userid
            })
        }).then((response) => response.json())
            .then((responseData) => {
                this.setState({ friends: responseData });
            });
      });

    }

    showDateTimePicker = () => {
        this.setState({ isDTPickerVisible: true });
    }

    handleDateTimePicker = () => {
        this.setState({ isDTPickerVisible: false });      // schließen
    }

    handleDateTimePicked = (datetime) => {
        this.setState({ datetime });     // datum auswählen
        this.handleDateTimePicker();        // wieder schließen
        this.addDate();
    }

    addDate() {
        //const { datetime } = this.state;
        const datetime = this.state.datetime;
        const dates = this.state.dates;
        // eine eigene Variable für Anzeige-Format
        const newdate = {
            id: this.state.dates.length + 1,
            date: moment(datetime).format('DD.MM.YYYY, HH:mm:ss')
        };
        // eine eigene Variable für MySQL-Format
        const newmysqldate = {
            id: this.state.dates.length + 1,
            date: moment(datetime).format('YYYY-MM-DD HH:mm:ss')
        };

        let checkIfExists = false;
        for (let i = 0; i < dates.length; i++) {
            if (dates[i].date === newdate.date) {
                checkIfExists = true;
            }
        }

        if (datetime > moment() && checkIfExists !== true) {        // existiert nicht
            return this.setState({
              dates: this.state.dates.concat(newdate),
              mysqldates: this.state.mysqldates.concat(newmysqldate) });
        } else {
            return;         // doppelt, deswegen weg
        }
    }

    onDelete(date) {
        const dates = this.state.dates;
        for (let i = 0; i < this.state.dates.length; i++) {
            if (dates[i].id === date.id) {
                dates.splice(i, 1);
            }
        }
        this.setState({ dates });
    }

    renderDates() {
        return this.state.dates.map(date =>
            <DatePicked key={date.id} date={date} onDelete={this.onDelete.bind(this, date)} />
        );
    }

    onDeleteFriend(friend) {
        const eventfriends = this.state.eventfriends;
        for (let i = 0; i < this.state.eventfriends.length; i++) {
            if (eventfriends[i].friend_id === friend.friend_id) {
                eventfriends.splice(i, 1);
            }
        }
        this.setState({ eventfriends });      // nur eventfriends!
    }

    renderFriends() {
        return this.state.eventfriends.map(friend =>
            <FriendPicked key={friend.friend_id} friend={friend} onDelete={this.onDeleteFriend.bind(this, friend)} />
        );
    }

    addEventFriends(value) {
        const friends = this.state.friends;
        const eventfriends = this.state.eventfriends;
        const addedFriend = {
            friend_id: value,
            name: '',
            surname: ''
        };

        for (let i = 0; i < friends.length; i++) {
            if (friends[i].friend_id === value) {
                addedFriend.name = friends[i].name;
                addedFriend.surname = friends[i].surname;
            }
        }

        let checkIfExists = false;
        for (let i = 0; i < eventfriends.length; i++) {
            if (eventfriends[i].friend_id === value) {
                checkIfExists = true;
            }
        }
        if (checkIfExists !== true) {
            this.setState({ eventfriends: this.state.eventfriends.concat(addedFriend) });
        } else {
            return;
        }
    }

    handlePickerValueChanged = value => {
        this.setState({ selectedFPickerValue: value });
        this.addEventFriends(value);
    }

    handleSingleChecked() {
        if (this.state.singleChecked === true) {
            this.setState({ singleChecked: false, typ: '' });        // doppelklick
        } else {
            this.setState({ singleChecked: true, typ: 'single', multiChecked: false });
        }
        //this.setState({ singleChecked: !this.state.singleChecked });
    }

    handleMultiChecked() {
        if (this.state.multiChecked === true) {
            this.setState({ multiChecked: false, typ: '' });
        } else {
            this.setState({ multiChecked: true, typ: 'multiple', singleChecked: false });
        }
        //this.setState({ multiChecked: !this.state.multiChecked });
    }

    createEvent() {
        let eventid = '';

        if (this.state.name === '' || this.state.anlass === '' || this.state.typ === '' ||
            this.state.dates.length === 0 ||
            this.state.eventfriends.length === 0 ||
            Object.keys(this.state.placeDataPicked).length === 0) {
              // man muss es so schreiben -> weil es ein JS Objekt ist

            this.buttonCreate.error();
            Alert.alert(
                'Event erstellen',
                'Bitte fülle zuerst alles aus!',
                [
                    { text: 'OK', onPress: () => { this.buttonCreate.reset(); Actions.refresh(); } }
                ]
            );

        } else {
            // Event anlegen in DB

             fetch('http://triangle.bulme.at/~pi/EveAPI/EventForm/insertevents.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: this.state.userid,
                    managerid: this.state.userid,
                    name: this.state.name,
                    anlass: this.state.anlass,
                    typ: this.state.typ,
                    latitude: this.state.placeDataPicked.latitude,
                    longitude: this.state.placeDataPicked.longitude,
                    address: this.state.placeDataPicked.address
                })
            }).then((response) => response.json())
                .then((responseData) => {
                    let idArray = [];
                    idArray = responseData;
                    eventid = idArray[0].id;

                    for (let i = 0; i < this.state.eventfriends.length; i++) {
                        fetch('http://triangle.bulme.at/~pi/EveAPI/EventForm/inserteventfriends.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                managerid: this.state.userid,
                                eventid: eventid,              // this.state.eventid
                                eventfriendid: this.state.eventfriends[i].friend_id
                            })
                        });
                    }
                }).then(() => {
                 fetch('http://triangle.bulme.at/~pi/EveAPI/EventForm/insertmeinevent.php', {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({
                         managerid: this.state.userid,
                         eventid: eventid       // this.state.eventid
                     })
                 }).then(() => {
                     for (let i = 0; i < this.state.dates.length; i++) {
                         fetch('http://triangle.bulme.at/~pi/EveAPI/EventForm/inserteventquestions.php', {
                             method: 'POST',
                             headers: {
                                 'Content-Type': 'application/json',
                             },
                             body: JSON.stringify({
                                 eventid: eventid,          // this.state.eventid
                                 question: this.state.mysqldates[i].date
                             })
                         });
                     }
                     this.buttonCreate.success();
                     setTimeout(() => { Actions.pop({ refresh: { refresh: Math.random() } }); }, 500);
                 });
             });
        }
    }

    openSearchModal() {
        RNGooglePlaces.openAutocompleteModal({ useOverlay: true })
            .then((place) => {
                this.setState({ placePicked: place.address, placeDataPicked: place });
            })
            .catch(error => {
                Alert.alert('Fehler bei der Standortauswahl',
                'Bitte nochmal versuchen');
            });
    }

    render() {
        return (
            <ScrollView>
                <Card>
                    <CardItem>
                        <FormInput
                            label="Name"
                            value={this.state.name}
                            onChangeText={name => this.setState({ name })}
                            autoFocus={true}
                        />
                    </CardItem>
                    <CardItem>
                        <FormInput
                            label="Anlass"
                            value={this.state.anlass}
                            onChangeText={anlass => this.setState({ anlass })}
                            autoFocus={false}
                        />
                    </CardItem>
                    <CardItem>
                        <Text style={styles.titleStyle}>Typ</Text>

                        <View style={styles.viewStyle}>
                            <CheckBox
                                color={'#2c3e50'}
                                checked={this.state.singleChecked}
                                onPress={() => this.handleSingleChecked()}
                            />
                            <Text style={styles.labelStyle}>single</Text>
                        </View>

                        <View style={styles.viewStyle}>
                            <CheckBox
                                color={'#2c3e50'}
                                checked={this.state.multiChecked}
                                onPress={() => this.handleMultiChecked()}
                            />
                            <Text style={styles.labelStyle}>multiple</Text>
                        </View>
                    </CardItem>
                    <CardItem>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => this.openSearchModal()}
                            >
                                <Text style={styles.placePickerStyle}>
                                  {this.state.placePicked}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </CardItem>
                </Card>

                <Card>
                    <CardItem>
                        <View style={styles.viewStyle}>
                            <Text style={styles.titleStyle}>Termine</Text>
                            <Button
                                buttonStyle={styles.datetimeButtonStyle}
                                fontSize={18}
                                title="Termin hinzufügen"
                                onPress={this.showDateTimePicker}
                            />
                        </View>
                        <DateTimePicker
                            isVisible={this.state.isDTPickerVisible}
                            onConfirm={this.handleDateTimePicked}
                            onCancel={this.handleDateTimePicker}
                            mode="datetime"
                        />
                    </CardItem>
                    <View>
                        {this.renderDates()}
                    </View>
                </Card>

                <Card>
                    <Picker
                        style={{ color: 'rgba(0, 0, 0, 0.9)' }}
                        selectedValue={this.state.selectedFPickerValue}
                        onValueChange={value => this.handlePickerValueChanged(value)}
                    >
                        {this.state.friends.map(friend => (
                                <Picker.Item key={friend.friend_id} label={friend.name.concat(' ', friend.surname)} value={friend.friend_id} />
                            ))}
                    </Picker>
                    <View>
                        {this.renderFriends()}
                    </View>
                </Card>

                <View style={{ flex: 1, alignItems: 'center', paddingTop: 5, justifyContent: 'center' }}>
                    <AButton
                        foregroundColor="rgb(255,255,255)"
                        label="Erstellen"
                        labelStyle={{ color: 'rgba(255,255,255, 0.9)', fontSize: 18 }}
                        onPress={() => this.createEvent()}
                        ref={ref => (this.buttonCreate = ref)}
                        successIconName="check"
                        scaleOnSuccess
                        successIconColor="rgb(255,255,255)"          // #4cd964
                        shakeOnError
                        errorIconColor='red'
                        errorIconName="warning"
                        style={{ backgroundColor: '#00B15E', width: 300, height: 50, marginTop: 8 }}
                        iconSize={20}
                    />
                </View>
            </ScrollView>
        );
    }
}

/*
    <Button
                        buttonStyle={{ flex: 1, backgroundColor: '#00B15E', width: 300 }}
                        fontSize={18}
                        title='Erstellen'
                        onPress={() => this.createEvent()}
                        disabled={this.state.disableButton}
                    />
 */             // BUTTON von EVENTFORM ZU EVENT ERSTELLEN

const styles = {
    viewStyle: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleStyle: {
        fontSize: 18,
        color: 'rgba(0, 0, 0, 0.9)',
        paddingLeft: 20,
        flex: 1
    },
    labelStyle: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.9)',
        paddingLeft: 17
    },
    datetimeButtonStyle: {
        marginLeft: 5,
        marginBottom: 5,
        backgroundColor: '#00B15E'
    },
    textStyle: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.9)',
        paddingLeft: 17
    },
    placePickerStyle: {
        fontSize: 17,
        color: 'rgba(0, 0, 0, 0.9)',
        textAlign: 'center'
    }
};

export default EventForm;

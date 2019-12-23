import React, { Component } from 'react';
import { ScrollView, View, Text, Switch, Picker } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import 'whatwg-fetch';
import Realm from "realm";

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

class MapSettings extends Component {

    state = {
        userid: '',
        switchValue: false,
        locationfriends: [],
        myfriends: [],
        pickerValue: '',
        disableButton: false

    };

    componentWillMount() {
      Realm.open({
        schema: [MessageSchema,UserSchema]
      }).then(realm => {
        let result = realm.objects('userdata');
        this.setState({ userid: result[0].userid }, () => { // state gleich gesetzt
        });
      }).then(() => {
        this.initSettings();    //hole voreinstellungen , zb ob ghostmode
      });
        // hier alle INITIAL WERTE reinholen


    }



    initSettings = () => {
        fetch('http://triangle.bulme.at/~pi/GeolocationAPI/initsettings.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: this.state.userid
            })
        }).then((response) => response.json())
            .then((responseData) => {
                let modeArray = [];
                modeArray = responseData;
                if (modeArray.length !== 0)
                {
                    if (modeArray[0].ghostmode === '0') {
                        this.setState({ switchValue: false });
                    }
                    else
                    {
                        this.setState({ switchValue: true });
                    }
                }
                else {
                    return;
                }
            }).then(() => {
            fetch('http://triangle.bulme.at/~pi/GeolocationAPI/initfriendssettings.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: this.state.userid
                })
            }).then((response) => response.json())
                .then((responseData) => {
                    this.setState({ locationfriends: responseData });   //locationfriends ... freunde die dich sehen dürfen
                });
        }).then(() => {
            fetch('http://triangle.bulme.at/~pi/GeolocationAPI/fetchfriends.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: this.state.userid
                })
            }).then((response) => response.json())
                .then((responseData) => {
                    this.setState({ myfriends: responseData });
                });
        });

    }



    removeItem(friend) {
        const locationfriends = this.state.locationfriends;

        for (let i = 0; i < locationfriends.length; i++)
        {
            if (locationfriends[i].id === friend.id)
            {
                locationfriends.splice(i, 1);       // an stelle i länge 1 weg
            }
        }

        this.setState({ locationfriends: locationfriends });
    }



    addItem(val) {
        const myfriends = this.state.myfriends;
        const locationfriends = this.state.locationfriends;
        const addItem = {
            id: val,
            name: '',
            surname: ''
        }

        for (let i = 0; i < myfriends.length; i++)    //alle freunde durchgehen
        {
            if (myfriends[i].friend_id === val)
            {   // füge hinzu aus freundesliste
                addItem.name = myfriends[i].name;
                addItem.surname = myfriends[i].surname;
            }
        }

        let doesExist = false;
        for (let i = 0; i < locationfriends.length; i++)
        {
            if (locationfriends[i].id === val)
            {
                doesExist = true;       // eintrag existiert schon in locationfriends
            }
        }
        if (doesExist !== true)
        {       // wenns nicht existiert, füge hinzu
            this.setState({ locationfriends: this.state.locationfriends.concat(addItem) });
        }
        else
        {
            return;     // sonst mache nix
        }
    }



    valueChange = val => {
        this.setState({ pickerValue: val });
        this.addItem(val);
    }



    handleSave() {
        this.setState({ disableButton: true }); //wenn man ihn gedrückt hat, soll man ihn nicht mehr drücken könne, disableButton prop
        //console.log(this.state.switchValue, this.state.locationfriends);
        let ghostmode = '0';
        if (this.state.switchValue === true)
        {
            ghostmode = '1';
        }



        // update switch setting
        fetch('http://triangle.bulme.at/~pi/GeolocationAPI/updateghostmode.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: this.state.userid,
                ghostmode: ghostmode
            })
        }).then(() => {
            fetch('http://triangle.bulme.at/~pi/GeolocationAPI/resetview.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: this.state.userid
                })
            }).then(() => {
                for (let i = 0; i < this.state.locationfriends.length; i++)
                {
                    fetch('http://triangle.bulme.at/~pi/GeolocationAPI/updatefriendsettings.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userid: this.state.userid,
                            friendid: this.state.locationfriends[i].id
                        })
                    });
                }
            });
        });
        this.setState({ disableButton: false });
        Actions.pop();          // zurück zur map, wenn man save button drückt
    }



    renderLocationFriends() {
        return this.state.locationfriends.map(friend =>
            <View key={friend.id} style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text style={{ paddingLeft: 10, color: 'black' }}>{friend.name + ' ' + friend.surname}</Text>
                <Icon
                    name="location-off"
                    color='#00B15E'
                    onPress={this.removeItem.bind(this, friend)}
                    style={{ paddingRight: 10 }}
                />
            </View>
        );
    }



    render() {
        return (
            <View style={{ flex: 1, paddingTop: 15 }}>
                <ScrollView>
                    <View style={styles.ModeContainer}>
                        <View>
                            <Text style={styles.Title}>Ghost-Mode</Text>
                            <Text style={styles.SubTitle}>
                                When this is enabled, your friends cant see your location.
                            </Text>
                        </View>
                        <View>
                            <Switch value={this.state.switchValue} onValueChange={() => this.setState({ switchValue: !this.state.switchValue })} />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.Title}>WHO CAN SEE MY LOCATION </Text>
                        <Text style={styles.SecondTitle}>Select Friends...</Text>

                        <Picker
                            style={{ color: 'rgba(0, 0, 0, 0.5)' }}
                            selectedValue={this.state.pickerValue}
                            onValueChange={val => this.valueChange(val)}
                        >
                            {this.state.myfriends.map(friend =>
                                (
                                    <Picker.Item color="green"  key={friend.friend_id} label={friend.name.concat(' ', friend.surname)} value={friend.friend_id} />
                                )
                            )}
                        </Picker>

                        <View>
                            {this.renderLocationFriends()}
                        </View>
                        <View style={{ alignItems: 'center', paddingTop: 15 }}>
                            <Button
                                buttonStyle={styles.ButtonSaveStyle}
                                fontSize={17}
                                title='Save'
                                onPress={() => this.handleSave()}
                                disabled={this.state.disableButton}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}



const styles = {
    Title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.8)',
        paddingLeft: 10
        //paddingTop: 10
    },

    SubTitle: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.6)',
        paddingLeft: 15,
        maxWidth: 200
    },

    ModeContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    SecondTitle: {
        fontSize: 17,
        color: 'rgba(0,0,0,0.8)',
        paddingLeft: 10,
        paddingTop: 5
    },

    ButtonSaveStyle: {
        width: 200,
        backgroundColor: '#FF8000',            //'#00B15E',
        borderRadius: 50
    }
};

export default MapSettings;

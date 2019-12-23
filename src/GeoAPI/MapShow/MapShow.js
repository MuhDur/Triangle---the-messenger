import React, { Component } from 'react';
import { View, Text, Dimensions, Alert, TouchableOpacity } from 'react-native'; //react native -> library mit vorgefertigten componenten
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import 'whatwg-fetch';
import timer from 'react-native-timer';
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

//    --- bis hier hin nur imports

// functional component       class based components

/*
  const App = () => {
  return(<Text></Text>);
};

*/

class MapShow extends Component { //Einfach ne klasse wie in c#
    /*
        vllt für permissions
        https://github.com/webyonet/react-native-android-location-services-dialog-box
     */

     /*
      Unterschied state, props
      state... zustände von variablen die sich ständig ändern können
      bei jeder änderung von state (mit this.setState({ userid: '3'  })), weiß react native dass es neu rendern muss

      props... voreinstellungen, componente laden mit voreinstellungen (props)

     */
    state = {
        userid: '',
        initialRegion: {
            latitude: 47.076668,        // Graz: 47.076668, 15.421371
            longitude: 15.421371,
            latitudeDelta: 0.0322,      // das ist custom!
            longitudeDelta: Dimensions.get('window').width /        // Breite durch Höhe = Aspect Ratio
            Dimensions.get('window').height *                       // Aspect Ratio * latitudeDelta
            0.0322
        },
        locationfriends: [],
        eventlocations: [],
        ghostmode: '',
        myLocation: {
            latitude: 47.076668,
            longitude: 15.421371
        },
        liveModeOn: false
        //userHasInitialLocation: false
        //permission: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //locationPermission: ''
    };
/*
    constructor(props) {
      super(props);

      this.state = {
        userid: this.props.userid
      }
    }

    <MapShow userid='3'  />
*/


    componentDidMount() {
      Realm.open({
        schema: [MessageSchema,UserSchema]
      }).then(realm => {
        let result = realm.objects('userdata');
        this.setState({ userid: result[0].userid }, () => { // state gleich gesetzt
        });
      }).then(() => {
        this.getMyInitialLocation();        // hole mir meine Location -> und animate mir die Map dahin -> poste meine Location in die DB
        this.setMarkerOnMyLocation();        // das hier muss man machen, damit der Marker am Anfang auf deine pos gesetzt wird -> mit der Methode wird dein Marker VON JETZT gesetzt
        this.getFriendsLocations();         // Locations der Freunde -> Marker setzen (sind in DB gespeichert)
        this.getEventLocations();
      });

      //Lifecyclemethods - methoden die aufgerufen werden, an bestimmten zeitpunkten abhängig davon was ihre funktion is
                            // componentdidmount - app das erste mal öffnen alles wird alles gerenderd, mit didmount nochmal
                            //hat schon einmal gerenderd aber soll nochmal rendern wenn sich state ändert
                            // Will renderd zuerst

    }

    componentWillUnmount() {
      if(this.state.liveModeOn) {     // wenn noch an
        this.turnLiveModeOff();       // zuerst ausschalten!
      }
    }

    /*
    getMyMarkerLocation() {
        fetch('http://triangle.bulme.at/~pi/GeolocationAPI/fetchmylocation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: this.state.userid
            })
        }).then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                let Array = [];
                Array = responseData;
                if (Array.length !== 0)
                {
                    let coords = {
                        latitude: parseFloat(Array[0].latitude),
                        longitude: parseFloat(Array[0].longitude)
                    };
                    this.setState({ mylocation: coords });
                }
                else
                {
                    let coords = {
                        latitude: this.state.initialRegion.latitude,
                        longitude: this.state.initialRegion.longitude
                    };
                    this.setState({ mylocation: coords });
                }
            });
    }
    */      // nur wenn der Marker auf die letzte pos aus DB gesetzt werden soll ''''''DEPRECATED''''''



    getMyInitialLocation = () => {    //arrow funktion -
        navigator.geolocation.getCurrentPosition(pos => {   //navigator... is ne vorgegebene funktion, getcurret auch
                const coordsEvent = { //coordsEvent variable, object weil {} , array[],
                    nativeEvent: { //nativeEvent object
                        coordinate: { //coordinate object
                            latitude: pos.coords.latitude,  //.coords vorgegeben
                            longitude: pos.coords.longitude
                        }
                    }
                };
                this.pickLocationHandler(coordsEvent);      // map animate dahin
                this.postMyLocation(coordsEvent);           // location posten in die DB
            },
            err => {
                console.log(err);
                Alert.alert('Positionierung fehlgeschlagen', 'Schalte bitte zuerst GPS ein und versuchs nochmal!');
            }
        );
    }           // kommentiert



    setMarkerOnMyLocation = () => {
        navigator.geolocation.getCurrentPosition(pos => {
                const coordsEvent = {
                    nativeEvent: {
                        coordinate: {
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude
                        }
                    }
                };
                this.pickMyLocation(coordsEvent);       // setze marker auf coordsEvent -> deine pos
            },
            err => {
                console.log(err);
                Alert.alert('Positionierung fehlgeschlagen', 'Schalte bitte zuerst GPS ein und versuchs nochmal!');
            }
        );
    }          // kommentiert


    getMyLocation = () => {
        navigator.geolocation.getCurrentPosition(pos => {
                const coordsEvent = {
                    nativeEvent: {
                        coordinate: {
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude
                        }
                    }
                };
                this.pickLocationHandler(coordsEvent);      // animate die map dahin (mit coordsEvent -> meine jz pos)
                this.pickMyLocation(coordsEvent);           // setze Marker auf meine jz pos
                //this.postMyLocation(coordsEvent);        //-> würde dir jedes Mal beim ButtonKlick (Icon rechts unten) die Location in die Datenbank posten
            },
            err => {
                console.log(err);
                Alert.alert('Positionierung fehlgeschlagen', 'Schalte bitte zuerst GPS ein und versuchs nochmal!');
            }
        );
    }                   // kommentiert (ist Funktion für Icon rechts unten)



    getFriendsLocations = () => {
        fetch('http://triangle.bulme.at/~pi/GeolocationAPI/fetchmyfriends.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: this.state.userid
            })
        }).then((response) => response.json())
            .then((responseData) => {
            //    console.log(responseData);
                let friendArray = [];   //const überschreibt man nicht mehr, let normale variable
                friendArray = responseData; //responseData immer ARRAY
                if (friendArray.length !== 0) { //wenn .length nicht 0 -> iwas is drinnen
                    let newArray = [];
                    for (let i = 0; i < friendArray.length; i++) {  //mit der for sollen die sachen aus der response in meine state variable (locationsfriends) geschrieben werden
                        const specObject = {
                            user_id: friendArray[i].user_id,
                            name: friendArray[i].name,
                            surname: friendArray[i].surname,
                            coords: {
                                latitude: parseFloat(friendArray[i].latitude), //parseFloat wandlet in float um
                                longitude: parseFloat(friendArray[i].longitude)
                            }
                        }
                        newArray = newArray.concat(specObject); //concat verbinden, dazuaddieren
                    }
                    this.setState({ locationfriends: newArray });
                } else {
                    return;   //sonst fehler, also nichts machen
                }
            });

    }               // kommentiert ... ist nur DB geschichtl

    getEventLocations = () => {
        fetch('http://triangle.bulme.at/~pi/GeolocationAPI/fetchmyevents.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: this.state.userid
            })
        }).then((response) => response.json())
            .then((responseData) => {
                let eventArray = [];
                eventArray = responseData;
                if (eventArray.length !== 0) {
                    let newArray = [];
                    for (let i = 0; i < eventArray.length; i++) {
                        const specObject = {
                            id: eventArray[i].id,
                            name: eventArray[i].name,
                            coords: {
                                latitude: parseFloat(eventArray[i].latitude),
                                longitude: parseFloat(eventArray[i].longitude)
                            }
                        }
                        newArray = newArray.concat(specObject);
                    }
                    this.setState({ eventlocations: newArray });
                } else {
                    return;
                }
            });
    }

    pickLocationHandler = event => {    //event = coordsEvent
        const coords = event.nativeEvent.coordinate;
        this.map.animateToRegion({    //animateToRegion vorgefertigt
            ...this.state.initialRegion,            // animate auf meine pos, hier im ... stehen die DELTA
            latitude: coords.latitude,              // meine latitude
            longitude: coords.longitude             // meine longitude
        });
        this.setState(prevState => {
            return {
                initialRegion: {
                    ...prevState.initialRegion,     // initialRegion ... hier die Delta
                    //prevState.initialRegion übernehmen der dinge von vorher
                    latitude: coords.latitude,      // this.state.initialRegion (bei der map angehängt) map zeigt das an -> meine pos
                    longitude: coords.longitude
                }
            };
        });

/*
        const tempCoords = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.04
        }

        this.setState({ initialRegion: tempCoords });
*/


    };          // kommentiert -> map animate



    pickMyLocation = event => {
        const coords = event.nativeEvent.coordinate;
        this.map.animateToRegion({
            ...this.state.initialRegion,  //deltas klauen
            latitude: coords.latitude,
            longitude: coords.longitude
        });
        this.setState({ myLocation: {
                    latitude: coords.latitude,
                    longitude: coords.longitude
                }
        });
    };          // kommentiert -> Marker auf meine pos setzen



    postMyLocation(location) {
        // überprüfe ob du in ghostmode bist
        fetch('http://triangle.bulme.at/~pi/GeolocationAPI/checkifghostmode.php', {
            method: 'POST',   //GET / POST ... GET is nur holen, POST beides
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                userid: this.state.userid
            })
        }).then((response) => response.json())  //.then wenn alles fertig und response dann ...
            .then((responseData) => {
                //console.log('ghostmode:', responseData);
                const ghostmodeArray = responseData;
          //      this.state.ghostmode = '3';  NICHT dirket mutieren
                if (ghostmodeArray.length === 0) {    //no response vom server, length... 0 -> fehler ERROR HANDLING
                    this.setState({ ghostmode: '0' }); // dann wird ghostmode 0 gesetzt
                } else {
                    this.setState({ ghostmode: ghostmodeArray[0].ghostmode });  //sonst krieg ich was zurück und setzte ghostmode
                }
            }).then(() => {
            // entweder ghostmode = 1 oder ghostmode = 0
            if (this.state.ghostmode === '0') {   //abfragen darf man dirket
                fetch('http://triangle.bulme.at/~pi/GeolocationAPI/postmylocation.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    body: JSON.stringify({        // AB HIER INSERTEN **********************************************
                        userid: this.state.userid,
                        ghostmode: this.state.ghostmode,
                        latitude: location.nativeEvent.coordinate.latitude,
                        longitude: location.nativeEvent.coordinate.longitude
                    })
                });
            } else {
                fetch('http://triangle.bulme.at/~pi/GeolocationAPI/postmylocation.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userid: this.state.userid,
                        ghostmode: this.state.ghostmode,
                        latitude: location.nativeEvent.coordinate.latitude,
                        longitude: location.nativeEvent.coordinate.longitude
                    })
                });
            }
        });
    }               // kommentiert -> act pos am Anfang in db speichern

    liveLocationHandle = () => {
      navigator.geolocation.getCurrentPosition(pos => {
              const coordsEvent = {
                  nativeEvent: {
                      coordinate: {
                          latitude: pos.coords.latitude,
                          longitude: pos.coords.longitude
                      }
                  }
              };

              this.pickMyLocation(coordsEvent);           // setze Marker auf meine jz pos, und animate mir dahin
              this.postMyLocation(coordsEvent);        //-> würde dir jedes Mal beim ButtonKlick (Icon rechts unten) die Location in die Datenbank posten
          },
          err => {
              console.log(err);
              Alert.alert('Positionierung fehlgeschlagen', 'Schalte bitte zuerst GPS ein und versuchs nochmal!');
          }
      );
    }

    turnLiveModeOn = () => {
      this.setState({ liveModeOn: true });
      timer.setInterval('LiveMode', this.liveLocationHandle, 180000);   // 3 min == 180000ms
    }

    turnLiveModeOff = () => {
      this.setState({ liveModeOn: false });
      timer.clearInterval('LiveMode');
    }

    renderFriends() {
        return this.state.locationfriends.map(friend => //array.map wie eine schleife geht alles durch und macht für jeden einzelnen eintrag(hier friend) das untere
            <View key={friend.user_id}>
                <MapView.Marker onPress={this.pickLocationHandler} //Wenn man den Marker anklickt zoomt es auf die Position
                  pinColor = 'green'
                  title={friend.name + ' ' + friend.surname} coordinate={friend.coords} />
            </View>
        );
    }               // array.map()      dient dazu um eine Funktion (hier: marker setzen) für alle Freunde zu machen, die man von DB reinkriegt

    renderEvents() {
        return this.state.eventlocations.map(event =>
            <View key={event.id}>
                <MapView.Marker onPress={this.pickLocationHandler}
                pinColor= 'purple'
                title={event.name} coordinate={event.coords} />
            </View>
        );
    }

    renderLiveButton() {
      if (this.state.liveModeOn) {
        return (
          <TouchableOpacity style={styles.StyleLiveModeOn} onPress={this.turnLiveModeOff}>
              <Text style={{ color: 'black' }}>LIVE</Text>
          </TouchableOpacity>
        );
      }

      return (
        <TouchableOpacity style={styles.StyleLiveModeOff} onPress={this.turnLiveModeOn}>
            <Text style={{ color: 'black' }}>LIVE</Text>
        </TouchableOpacity>
      );

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity style={styles.StyleSettingsTouchable} onPress={() => Actions.mapsettings()}>
                    <Icon name="md-settings" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.StyleLocateTouchable} onPress={this.getMyLocation}>
                    <Icon name="md-locate" size={45} color="black" />
                </TouchableOpacity>
                {this.renderLiveButton()}
                <MapView
                    style={{ width: '100%', height: '100%', zIndex: -1 }}
                    initialRegion={this.state.initialRegion}  //initialRegion = region die gerade angezeigt wird
                    ref={ref => { this.map = ref; } }  //Referenz damit man die map direkt ansprechen kann und die funktionen oben verwenden kann
                    onPress={this.pickLocationHandler}
                >
                    <MapView.Marker onPress={this.pickLocationHandler}
                    title="Ich" coordinate={this.state.myLocation} />
                    {this.renderFriends()}
                    {this.renderEvents()}
                </MapView>
            </View>
        );
    }
}



const styles = {
    StyleSettingsTouchable: {
        top: 10,
        right: 10,
        elevation: 1,
        position: 'absolute'
    },
    StyleLocateTouchable: {
        bottom: 10,
        right: 13,
        elevation: 1,
        position: 'absolute'
    },
    StyleLiveModeOn: {
      bottom: 60,
      right: 10,
      elevation: 1,
      position: 'absolute',
      borderRadius: 30,
      borderColor: 'black',
      width: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'green',
      borderColor: 'black'
    },
    StyleLiveModeOff: {
      bottom: 60,
      right: 10,
      elevation: 1,
      position: 'absolute',
      borderRadius: 30,
      width: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'black'
    }

};

export default MapShow;

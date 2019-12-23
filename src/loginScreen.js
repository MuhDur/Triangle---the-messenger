import React, { Component } from 'react';
import { Alert, View ,Text, TextInput, ScrollView } from 'react-native';
import 'whatwg-fetch';
import { Actions } from 'react-native-router-flux';
import Realm from 'realm';

import TextInputLogin from './loginScreen/LoginInput'
import LoginButton from'./loginScreen/LoginButton'
import RegistrationFormButton from'./loginScreen/RegistrationFormButton'
import Card from './loginScreen/Card'
import CardSection from './loginScreen/CardSection'



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

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      username: '',
      realm: null,
      temp: [],
      userid: 0,
      username: '',

    };


  }
  componentWillMount() {
    Realm.open({ // open connection
      schema: [MessageSchema,UserSchema]}).then(realm => { // here is realm
      let result = realm.objects('userdata');
    this.setState({username: result[0].username });
    this.setState({password: result[0].password });
      this.setState({realm});  // set it to state
      if (this.state.realm.objects('userdata').length == 0){
        realm.write(() => {
          realm.create('userdata', {id: 1, username: '', password: '', userid: 0});
        });
      }
      realm.close();
      if(this.state.username != '' && this.state.password != ''){
        const {password} = this.state;
        const {username} = this.state;
        if (username != '') {
          if(password !=''){
            fetch('http://triangle.bulme.at/~pi/MainAPI/Login/UserLogin.php', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({

                password: password,
                username: username,

              })
            }).then((response) => response.json())
              .then((responseJson) => {
                if(responseJson === 'Data Matched')
                {
                  fetch('http://triangle.bulme.at/~pi/MainAPI/Login/GetUserID.php', {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({

                      username: username,

                    })
                  }).then((response) => response.json())
                    .then((responseJson) => {
                      let uid_temp = parseInt(responseJson, 10);
                      Realm.open({ // open connection
                        schema: [MessageSchema,UserSchema]}).then(realm => { // here is realm
                        realm.write(() => {
                          realm.create('userdata', {id: 1, username: username, password: password, userid: uid_temp}, true );
                        });

                      })
                      realm.close()
                    }).then((responseJson) => {
                    Actions.main()
                  }).done()
                } else{

                  Alert.alert(responseJson.toString());
                }
              }).catch((error) => {
              console.error(error);
            }).done();
          } else {
            Alert.alert('Please enter password')
          }
          } else {
          Alert.alert('Please enter username')
        }}
    });
  };


  UserLoginFunction = () => {

    const {password} = this.state;
    const {username} = this.state;


    if (username != '') {
      if(password !=''){
        fetch('http://triangle.bulme.at/~pi/MainAPI/Login/UserLogin.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({

            password: password,
            username: username,

          })
        }).then((response) => response.json())
          .then((responseJson) => {
            
            if(responseJson === 'Data Matched')
            {
              fetch('http://triangle.bulme.at/~pi/MainAPI/Login/GetUserID.php', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                  username: username,

                })
              }).then((response) => response.json())
                .then((responseJson) => {
                  let uid_temp = parseInt(responseJson, 10);
                  Realm.open({ // open connection
                    schema: [MessageSchema,UserSchema]
                  }).then(realm => { // here is realm
                    realm.write(() => {
                      realm.create('userdata', {id: 1, username: username,
                        password: password, userid: uid_temp}, true);
                    });
                    let result = realm.objects('userdata');
                    this.setState({userid: result[0].userid}, () => {
                    });
                    this.setState({username: result[0].username}, () => {
                    });
                    realm.close()
                  })
                }).then((responseJson) => {
                Actions.main()
              }).done()


            }else{

              Alert.alert(responseJson.toString());
            }


          }).catch((error) => {
          console.error(error);
        }).done();

      } else {
        Alert.alert('Please enter password')
      }

    } else {
      Alert.alert('Please enter username')
    }
  };

  UserRegistrationFormFunction = () => {
    Actions.register()
  }


  render() {
    return (

      <Card>
        <CardSection>
          <Text style= {{ fontSize: 20, color: "#000", textAlign: 'center', marginBottom: 15 }}>Login</Text>
        </CardSection>
        <CardSection>
          <TextInputLogin
            onChangePassword={(password) => this.setState({password})}
            onChangeUsername={(username) => this.setState({username})}
          />
        </CardSection>
        <CardSection>
          <LoginButton
            UserLoginFunction={this.UserLoginFunction}
          />
        </CardSection>
        <CardSection>
          <RegistrationFormButton
            UserRegistrationFormFunction={this.UserRegistrationFormFunction}
          />
        </CardSection>
      </Card>
    );
  }
}



export default LoginScreen;

import React, { Component } from 'react';
import { Alert, View ,Text, TextInput, ScrollView } from 'react-native';
import 'whatwg-fetch';

import RegistrationTextInput from './registrationScreen/RegistrationInput'
import RegistrationButton from'./registrationScreen/RegistrationButton'
import Card from './registrationScreen/Card'
import CardSection from './registrationScreen/CardSection'


class RegistrationScreen extends Component {
  constructor(props) {
    super(props)
  this.state = {

      email: '',
      password: '',
      username: '',
      name: '',
      surname: '',
      postcode: '',

    };
  }
  UserRegistrationFunction = () => {
    const {email} = this.state;
    const {password} = this.state;
    const {username} = this.state;
    const {name} = this.state;
    const {surname} = this.state;
    const {postcode} = this.state;
    if (email != '') {
      if(password != ''){
        if(username !=''){
          if(name !=''){
            if(surname !=''){
              if(postcode != ''){
                fetch('http://triangle.bulme.at/~pi/MainAPI/Registration/UserRegistration.php', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: email,
                    password: password,
                    username: username,
                    name: name,
                    surname: surname,
                    postcode: postcode,
                  })
                }).then((response) => response.json())
                  .then((responseJson) => {
                      Alert.alert(responseJson.toString());
                  }).catch((error) => {
                  console.error(error);
                }).done();
              }else {
                Alert.alert('Please enter postcode')
              }
            }else {
              Alert.alert('Please enter surname')
            }
          }else {
            Alert.alert('Please enter name')
          }
        }else {
          Alert.alert('Please enter username')
        }
      }else {
        Alert.alert('Please enter password')
      }
    } else {
      Alert.alert('Please enter email')
    }
  }
  render(){
    return(
      <Card>
        <CardSection>
          <Text style= {{ fontSize: 20, color: "#000", textAlign: 'center', marginBottom: 15 }}>User Registration Form</Text>
        </CardSection>
          <CardSection>
            <RegistrationTextInput
              onChangeEmail={(email) => this.setState({email})}
              onChangePassword={(password) => this.setState({password})}
              onChangeUsername={(username) => this.setState({username})}
              onChangeName={(name) => this.setState({name})}
              onChangeSurname={(surname) => this.setState({surname})}
              onChangePostcode={(postcode) => this.setState({postcode})}
            />
          </CardSection>
          <CardSection>
            <RegistrationButton
              UserRegistrationFunction={this.UserRegistrationFunction}
            />
          </CardSection>
      </Card>
    );
  }
}

export default RegistrationScreen;
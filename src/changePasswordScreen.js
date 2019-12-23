import React, { Component } from 'react';
import { Alert, View ,Text, TextInput, ScrollView } from 'react-native';
import 'whatwg-fetch';
import Realm from 'realm';

import Card from  './changePasswordScreen/Card';
import CardSection from  './changePasswordScreen/CardSection';
import Button from  './changePasswordScreen/Button';
import Input from  './changePasswordScreen/Input';

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

class ChangePassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      realm: null,
      userid: '',
      oldpassword: '',
      newpassword: '',
    };


  }
  componentWillMount() {
    Realm.open({ // open connection
      schema: [MessageSchema,UserSchema]}).then(realm => { // here is realm
      let result = realm.objects('userdata');
      this.setState({userid: result[0].userid}, () => {
      });
      realm.close();
    });
  };


  Function = () => {
    fetch('http://triangle.bulme.at/~pi/MainAPI/Settings/ChangePassword.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        userid: this.state.userid,
        oldpassword: this.state.oldpassword,
        newpassword: this.state.newpassword,

      })
    }).then(response => response.json())
      .then((responseJson) => {
        Alert.alert(responseJson.toString());
      }).done();
  }
  render() {
    return (
      <Card>
        <CardSection>
          <Text style= {{ fontSize: 20, color: "#000", textAlign: 'center', marginBottom: 15 }}>Change Password</Text>
        </CardSection>
        <CardSection>
          <Input
            onChange={(oldpassword) => this.setState({oldpassword})}
            text = "old password"
          />
        </CardSection>
        <CardSection>
          <Input
            onChange={(newpassword) => this.setState({newpassword})}
            text = "new password"
          />
        </CardSection>
        <CardSection>
          <Button
            Function = {this.Function}
            title = "Change Password"
          />
        </CardSection>
      </Card>

    );
  }
}

export default ChangePassword;
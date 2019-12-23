import React, { Component } from 'react';
import { Alert, View ,Text,} from 'react-native';
import 'whatwg-fetch';
import Realm from 'realm';

import Card from  './changeEmailScreen/Card';
import CardSection from  './changeEmailScreen/CardSection';
import Button from  './changeEmailScreen/Button';
import Input from  './changeEmailScreen/Input';

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

class ChangeEmail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      realm: null,
      userid: '',
      email:'',

    };


  }
  componentWillMount() {
    Realm.open({ // open connection
      schema: [MessageSchema,UserSchema]}).then(realm => { // here is realm
      this.setState({ realm });
      let result = realm.objects('userdata');
      this.setState({userid: result[0].userid}, () => {
      });
      realm.close();
    });
  };



  Function = () => {
    fetch('http://triangle.bulme.at/~pi/MainAPI/Settings/ChangeEmail.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        userid: this.state.userid,
        email: this.state.email,

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
          <Text style= {{ fontSize: 20, color: "#000", textAlign: 'center', marginBottom: 15 }}>Change Email</Text>
        </CardSection>
        <CardSection>
          <Input
            onChange={(email) => this.setState({email})}
            text = "new Email"
          />
        </CardSection>
        <CardSection>
          <Button
            Function = {this.Function}
          />
        </CardSection>
      </Card>

    );
  }
}

export default ChangeEmail;
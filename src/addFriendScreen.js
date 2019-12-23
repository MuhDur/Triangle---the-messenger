import React, { Component } from 'react';
import {Alert, Text} from 'react-native';
import 'whatwg-fetch';
import Realm from 'realm';

import Card from './addFriendScreen/Card';
import CardSection from './addFriendScreen/CardSection';
import AddFriendButton from './addFriendScreen/addFriendButton';
import AddFriendInput from './addFriendScreen/addFriendInput';

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

class AddFriend extends Component {
  constructor(props) {
    super(props)
    this.state = {
      realm: null,
      friendname: '',
      userid: 0,
      friendid: 0,
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

AddFriendFunction = () => {
  const {friendname} = this.state;
  fetch('http://triangle.bulme.at/~pi/MainAPI/Settings/GetFriendID.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({

      friendname: friendname,

    })
  }).then((response) => response.json())
    .then((responseJson) => {
      let uid_temp = parseInt(responseJson, 10);
      this.setState({friendid: uid_temp}, () => {
        fetch('http://triangle.bulme.at/~pi/MainAPI/Settings/AddFriend.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({

            userid: this.state.userid,
            friendid: this.state.friendid,

          })
        }).then(response => response.json())
          .then((responseJson) => {
            Alert.alert(responseJson.toString());
        }).done();
      });
    }).done()


}
  render() {
    return (
      <Card>
        <CardSection>
          <Text style= {{ fontSize: 20, color: "#000", textAlign: 'center', marginBottom: 15 }}>Add a Friend</Text>
        </CardSection>
        <CardSection>
          <AddFriendInput
            onChangeAddFriend={(friendname) => this.setState({friendname})}
          />
        </CardSection>
        <CardSection>
          <AddFriendButton
            Function = {this.AddFriendFunction}
          />
        </CardSection>
      </Card>

    );
  }
}

export default AddFriend;

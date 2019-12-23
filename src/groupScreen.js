import React, { Component } from 'react';
import { Alert, View ,Text, TextInput,
  ScrollView,Image } from 'react-native';
import 'whatwg-fetch';
import Realm from 'realm';

import GroupChatDetail from './groupScreen/GroupChatDetail';

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

class GroupScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      realm: null,
      userid: 0,
      groups: [],
    };
  }

  componentWillMount() {
    Realm.open({ // open connection
      schema: [MessageSchema,UserSchema]
    }).then(realm => { // here is realm
      let result = realm.objects('userdata');
      this.setState({userid: result[0].userid}, () => {
      });
      fetch('http://triangle.bulme.at/~pi/MainAPI/Settings/GetGroups.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: this.state.userid,
        })
      }).then(response => response.json())
        .then((responseData) => {
          if (responseData != 'no results') {
            this.setState({groups: responseData});
          } else {
            this.setState({groups: [{
                name: "You are not in a Group :(",
                id: "0",
              }
              ]
            });
          }
        });
    });
  }
  renderGroups() {
    return this.state.groups.map(group =>
      <GroupChatDetail key={group.id.toString()} group={group} userid={this.state.userid}/>
    );
  }

  render(){
    return(
      <ScrollView>
        {this.renderGroups()}
      </ScrollView>
    );
  }}

export default GroupScreen;
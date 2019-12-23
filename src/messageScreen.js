import React, { Component } from 'react';
import { Alert, View ,Text, TextInput,
  ScrollView,Image } from 'react-native';
import 'whatwg-fetch';
import Realm from 'realm';
import ChatDetail from './messageScreen/ChatDetail';

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

class MessageScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      realm: null,
      userid: 0,
      // Bei Freunden
      friends: [],
    };
  }

  componentWillMount() {
    Realm.open({ // open connection
      schema: [MessageSchema,UserSchema]
    }).then(realm => { // here is realm
      let result = realm.objects('userdata');
      this.setState({userid: result[0].userid}, () => {
      });
      fetch('http://triangle.bulme.at/~pi/MainAPI/Settings/GetFriends.php', {
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
            this.setState({friends: responseData});
          } else {
            this.setState({friends: [{
                username: "You dont have any Friends :(",
                id: "0",
              }
              ]
            });
          }
        });
    });
  }
  renderFriends() {
    return this.state.friends.map(friend =>
      <ChatDetail key={friend.id.toString()} friend={friend} userid={this.state.userid}/>
    );
  }

  render(){
    return(
<ScrollView>
  {this.renderFriends()}
  </ScrollView>
    );

  }

}

export default MessageScreen;

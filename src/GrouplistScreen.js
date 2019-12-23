import React, { Component } from 'react';
import { ScrollView, Alert, Text } from 'react-native';
import 'whatwg-fetch';
import GroupDetail from './grouplistScreen/GroupDetail';
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

class GroupList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      realm: null,
      userid: '',
      groups: [],
    }
  };

  componentWillMount() {
    Realm.open({ // open connection
      schema: [MessageSchema,UserSchema]
    }).then(realm => { // here is realm
      let result = realm.objects('userdata');
      this.setState({userid: result[0].userid}, () => {
      });
      realm.close();
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
      <GroupDetail key={group.id.toString()} group={group} userid={this.state.userid}/>
    );
  }


  render() {
    return (
      <ScrollView>
        {this.renderGroups()}
      </ScrollView>
    );
  }
}

export default GroupList;

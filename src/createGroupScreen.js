import React, { Component } from 'react';
import { Alert, View ,Text, TextInput, ScrollView } from 'react-native';
import 'whatwg-fetch';
import { Actions } from 'react-native-router-flux';
import Realm from 'realm';

import Card from  './createGroupScreen/Card';
import CardSection from  './createGroupScreen/CardSection';
import Button from  './createGroupScreen/Button';
import Input from  './createGroupScreen/Input';

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

class CreateGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      realm: null,
      userid : '',
      groupname: '',
      groupid: 0,
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


  FunctionCreate = () => {
    fetch('http://triangle.bulme.at/~pi/MainAPI/Settings/GetGroupID.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        groupname: this.state.groupname,

      })
    }).then((response) => response.json())
      .then((responseJson) => {
        let uid_temp = parseInt(responseJson, 10);
        this.setState({groupid: uid_temp}, () => {
          fetch('http://triangle.bulme.at/~pi/MainAPI/Settings/AddCreateGroup.php', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({

              userid: this.state.userid,
              groupid: this.state.groupid,

            })
          }).then(response => response.json())
            .then((responseJson) => {
              if(responseJson === 'Created')
              {
                Actions.addgroup({groupid : this.state.groupid})
              }
            }).done();
        });
      }).done()
  }

  render() {
    return (
      <Card>
        <CardSection>
          <Text style= {{ fontSize: 20, color: "#000", textAlign: 'center', marginBottom: 15 }}>Create a Group</Text>
        </CardSection>
        <CardSection>
          <Input
            onChange={(groupname) => this.setState({groupname})}
            text = "Groupname"
          />
        </CardSection>
        <CardSection>
          <Button
            Function = {this.FunctionCreate}
            title = "Create Group"
          />
        </CardSection>
      </Card>

    );
  }
}

export default CreateGroup;
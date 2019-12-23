import React, { Component } from 'react';
import { Alert, View ,Text, TextInput, ScrollView } from 'react-native';
import 'whatwg-fetch';
import { Actions } from 'react-native-router-flux';
import Realm from 'realm';

import ChooseSettingButton from './settingsScreen/chooseSettingButton';
import CardSection from './settingsScreen/CardSection';
import Card from './settingsScreen/Card';

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

class SettingsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      realm: null,
    };


  }
  componentWillMount() {

  };
  LogoutFunction = () => {
    Realm.open({ // open connection
      schema: [MessageSchema,UserSchema]
    }).then(realm => { // here is realm
      realm.write(() => {
        realm.create('userdata', {id: 1, username: '', password: '', userid: 0}, true);
      });
      realm.close()
    });

   Actions.login()
  }
  render() {
    return (
      <Card>
        <CardSection>
          <Text style= {{ fontSize: 20, color: "#000", textAlign: 'center', marginBottom: 15 }}>Settings</Text>
        </CardSection>
        <CardSection>
          <ChooseSettingButton
          Function = {Actions.CEmail}
          titletext = 'Change Email'
          />
        </CardSection>
        <CardSection>
          <ChooseSettingButton
           Function = {Actions.CPassword}
            titletext = 'Change Password'
          />
        </CardSection>
        <CardSection>
          <ChooseSettingButton
            Function = {Actions.AddFriend}
            titletext = 'Add Friend'
          />
        </CardSection>
        <CardSection>
          <ChooseSettingButton
            Function = {Actions.Flist}
            titletext = 'Friendlist'
          />
        </CardSection>
        <CardSection>
          <ChooseSettingButton
            Function = {Actions.CGroup}
            titletext = 'Create Group'
          />
        </CardSection>
        <CardSection>
          <ChooseSettingButton
            Function = {Actions.Glist}
            titletext = 'Grouplist'
          />
        </CardSection>
        <CardSection>
          <ChooseSettingButton
            Function = {this.LogoutFunction}
            titletext = 'Log Out'
          />
        </CardSection>
        <CardSection>
          <ChooseSettingButton
            Function = {Actions.main}
            titletext = 'Messagescreen'
          />
        </CardSection>
      </Card>

      );
  }
}

export default SettingsScreen;

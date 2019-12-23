import React, { Component } from 'react';
import { Alert, View ,Text, TextInput, ScrollView, PixelRatio } from 'react-native';
import { Router , Scene, Stack, Tabs } from 'react-native-router-flux';

import RegistrationScreen from './registrationScreen';
import LoginScreen from './loginScreen';
import MessageScreen from './messageScreen';
import Header from './messageScreen/Header';
import ChatScreen from './chatScreen';
import SettingsScreen from './settingsScreen';
import AddFriend from './addFriendScreen';
import ChangeEmail from './changeEmailScreen';
import ChangePassword from './changePasswordScreen';
import CreateGroup from './createGroupScreen';
import Friendlist from './FriendlistScreen';
import Grouplist from './GrouplistScreen';
import AddGroup from './addGroupUserScreen';
import GroupChatScreen from './groupChatScreen';
import GroupScreen from './groupScreen';
import EventList from './Eventmanager/eventlist/EventList';
import EventForm from './Eventmanager/eventform/EventForm';
import EventVote from './Eventmanager/eventvote/EventVote';
import MapShow from './GeoAPI/MapShow/MapShow';
import MapSettings from './GeoAPI/MapSettings/MapSettings';


const RouterComponent = () => {
  return (
<Router
  navigationBarStyle={styles.navBar}
  titleStyle={styles.navTitle}
  sceneStyle={styles.routerScene}
  barButtonIconStyle={styles.barContainer}
>
  <Scene key="root">
    <Stack hideNavBar={true}>
      <Scene key="login" component={LoginScreen} title="Login" hideNavBar ={true} initial/>
      <Scene key="register" component={RegistrationScreen} title="Register" hideNavBar={false} />
    </Stack>

    <Stack hideNavBar={true}>

      <Tabs
        key="main" tabs={true} hideNavBar={false}
        tabBarStyle={styles.tabBar}
        headerMode="screen" header={Header}
        labelStyle={{ fontFamily: 'rubik', fontSize: 15}}
        lazy
        >
            <Scene key="message" component={MessageScreen}  title="Messages"  hideNavBar ={true} initial />
            <Scene key="groups" component={GroupScreen} title="Groups" hideNavBar ={true}/>
            <Scene
              key="eventlist"
              component={EventList}
              title="Events"
              hideNavBar = {true}
            />
            <Scene
              key="mapshow"
              component={MapShow}
              title="Map"
              hideNavBar={true}
            />

    </Tabs>
      <Scene key="Settings" component={SettingsScreen} title="Settings" hideNavBar={true} />
      <Scene key="CEmail" component={ChangeEmail} title="Change Email" hideNavBar={false} />
      <Scene key="AddFriend" component={AddFriend} title="Add a Friend" hideNavBar={false} />
      <Scene key="CPassword" component={ChangePassword} title="Change Password" hideNavBar={false} />
      <Scene key="CGroup" component={CreateGroup} title="Create a Group" hideNavBar={false} />
      <Scene key="addgroup" component={AddGroup} title="Create a Group" hideNavBar ={true} />
      <Scene key="Flist" component={Friendlist} title="Friendlist" hideNavBar={false} />
      <Scene key="Glist" component={Grouplist} title="Grouplist" hideNavBar={false} />
      <Scene key="Chat" component={ChatScreen} title="Chat" lazy={true} hideNavBar={false} />
      <Scene key="GChat" component={GroupChatScreen} title="Groupchat" lazy={true} hideNavBar={false} />

      <Scene key="eventform" component={EventForm} title="Event erstellen" hideNavBar={false} />
      <Scene key="eventvote" component={EventVote} title="Termin-Auswahl" hideNavBar={false} />

      <Scene
        key="mapsettings"
        component={MapSettings}
        title="Settings"
        hideNavBar={false}
      />
    </Stack>
  </Scene>
</Router>
  );
};

const styles = {

  tabBar: {
    borderTopColor: 'black',
    borderTopWidth: 1 / PixelRatio.get(),
    backgroundColor: 'white',
    opacity: 0.98,
    justifyContent: 'center',
    alignItems: 'center'
  },

  navBar: {

    backgroundColor: '#5c63d8', // changing navbar color
  },
  navTitle: {
    color: '#2196F3', // changing navbar title color
  },
  routerScene: {
    backgroundColor: '#FFF',
    shadowOpacity:1,
    shadowRadius: 3,
  },
  barContainer: {
    color: '#2196F3',
  },
};

export default RouterComponent;

import React, { Component } from 'react';
import { Alert, View ,Text, TextInput,
  ScrollView,Image } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import {Actions} from "react-native-router-flux";
import Realm from 'realm';
import timer from "react-native-timer";

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

class ChatScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      realm: null,
      messages: [],
      text: 'Hallo',
      creatorid: 0,
      recipientid: parseInt(this.props.recipientid, 10),
      recipient_group_id: '0',
      creatorname: '',
      recipientname: this.props.recipientname,
      re: this.props.re,
    }}

  liveChat = () => {
    fetch('http://triangle.bulme.at/~pi/MainAPI/Messages/GetMessagelen.php',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: this.state.creatorid,
        friendid: this.state.recipientid,
      })
    }).then(response => response.json())
      .then((responseJson) => {
        if (responseJson != 'no results') {
          if (responseJson > this.state.messages.length) {
            this.setState({re: this.state.re + 1});
            Actions.refresh({
              key: this.state.re,
              recipientid: this.state.recipientid,
              recipientname: this.state.recipientname,
              re: this.state.re,
              title: this.state.recipientname})}}});
  }
  timerOn = () => {timer.setInterval('LiveChat', this.liveChat, 3000);}
  timeroff = () => {timer.clearInterval('LiveChat');}
  componentDidMount() {this.timerOn();}
  componentWillUnmount() {this.timeroff();}


  componentWillMount() {
    Realm.open({ // open connection
      schema: [MessageSchema, UserSchema]
    }).then(realm => { // here is realm
      let result = realm.objects('userdata');
      this.setState({creatorid: result[0].userid}, () => {
      });
      this.setState({creatorname: result[0].username}, () => {
      });

      fetch('http://triangle.bulme.at/~pi/MainAPI/Messages/GetMessage.php',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({

          userid: this.state.creatorid,
          friendid: this.state.recipientid,

        })
      }).then(response => response.json())
        .then((responseJson) => {
          if (responseJson != 'no results') {

            realm.write(() => {
              for (let i = 0; i < responseJson.length; i++) {
                let id_temp = parseInt(responseJson[i].id, 10);
                let creatorid_temp = parseInt(responseJson[i].creator_id, 10);
                let recipientid_temp = parseInt(responseJson[i].recipient_id, 10);
                let recgroupid_temp = parseInt(responseJson[i].recipient_group_id, 10);
                let datatype_temp = parseInt(responseJson[i].data_type, 10);
                let exists = realm.objects('messages').filtered('id = $0', id_temp);
                if (exists == 0) {

                  realm.create('messages', {
                    id: id_temp,
                    text: responseJson[i].text,
                    creatorid: creatorid_temp,
                    createdAt: responseJson[i].create_date,
                    recipientid: recipientid_temp,
                    recipient_group_id: recgroupid_temp,
                    datatype: datatype_temp,
                    creatorname: responseJson[i].creator_name,
                    recipientname: responseJson[i].recipient_name,

                  });
                }
              }
            })
            this.setState({realm});
            for (let i = 0; i < this.state.realm.objects('messages').filtered('creatorid = $0 AND recipientid = $1 OR recipientid =$0 AND creatorid =$1', this.state.recipientid, this.state.creatorid).length; i++) {
              let result = realm.objects('messages').filtered('creatorid = $0 AND recipientid = $1 OR recipientid =$0 AND creatorid =$1', this.state.recipientid, this.state.creatorid).sorted('createdAt', true);
              this.setState({
                messages:
                  [...this.state.messages,
                    ...[
                      {
                        _id: result[i].id,
                        text: result[i].text,
                        createdAt: result[i].createdAt,
                        user: {
                          _id: result[i].creatorid,
                          name: result[i].creatorname,
                        },
                      },
                    ]]
              })
            }
          }
          realm.close();
        }).done()

    });
  }

  onSend(messages = []) {
    const {creatorid} = this.state;
    let createdAt = new Date().toString();
    const {recipientid} = this.state;
    fetch('http://triangle.bulme.at/~pi/MainAPI/Messages/SendMessage.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        text: messages[0].text,
        creatorid: creatorid,
        createdAt: createdAt,
        recipientid: recipientid,
        creatorname: this.state.creatorname,
        recipientname: this.state.recipientname

      })
    }).done();

    fetch('http://triangle.bulme.at/~pi/MainAPI/Messages/GetMessageID.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        creatorid: creatorid,
        createdAt: createdAt,

      })
    }).then(response => response.json())
      .then((responseJson) => {
          Realm.open({ // open connection
            schema: [MessageSchema, UserSchema]}).then(realm => { // here is realm
            this.setState({ realm });
            realm.write(() => {
              for (let i = 0; i < responseJson.length; i++) {
                let id_temp = parseInt(responseJson[i].id, 10);
                let creatorid_temp = parseInt(responseJson[i].creator_id, 10);
                let recipientid_temp = parseInt(responseJson[i].recipient_id, 10);
                let recgroupid_temp = parseInt(responseJson[i].recipient_group_id, 10);
                let datatype_temp = parseInt(responseJson[i].data_type, 10);
                realm.create('messages', {
                  id: id_temp,
                  text: responseJson[i].text,
                  creatorid: creatorid_temp,
                  createdAt: responseJson[i].create_date,
                  recipientid: recipientid_temp,
                  recipient_group_id: recgroupid_temp,
                  datatype: datatype_temp,
                  creatorname: responseJson[i].creator_name,
                  recipientname: responseJson[i].recipient_name,

                });
              }
            });
            realm.close();
          });
        }
      ).done();
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble(props) {
    return (
      <View>
        <Text >{props.currentMessage.user.name}</Text>
        <Bubble{...props}/>
      </View>
    );
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: this.state.creatorid,
        }}
        renderBubble={this.renderBubble}
      />
    )
  }
}

export default ChatScreen;
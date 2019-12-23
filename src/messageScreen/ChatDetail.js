import React from 'react';
import {Actions} from "react-native-router-flux";
import Card from './Card';
import CardSection from './CardSection';
import Button from './Button';
import Realm from "realm";

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

const ChatDetail = ({ friend, userid }) => {
  const { id, username } = friend;
 const Function = () => {
   if (id != 0) {
     fetch('http://triangle.bulme.at/~pi/MainAPI/Messages/GetMessage.php', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         userid: userid,
         friendid: id,
       })
     }).then(response => response.json())
       .then((responseJson) => {
         if (responseJson != 'no results') {
           Realm.open({ // open connection
             schema: [MessageSchema, UserSchema]
           }).then(realm => {
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
                 }}
             })
             realm.close()
           });
         }}).then(() => {
       Actions.Chat({recipientid: id, recipientname: username, re: 0, title: username})
     }).done()}}

  return (
    <Card>
      <CardSection>
        <Button
        title = {username}
        Function = {Function}
        />
      </CardSection>
    </Card>
  );
};
export default ChatDetail;

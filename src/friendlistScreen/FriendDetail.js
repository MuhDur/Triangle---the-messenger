import React from 'react';
import {Alert} from 'react-native';
import {Actions} from "react-native-router-flux";
import Card from './Card';
import CardSection from './CardSection';
import Button from './Button';



const FriendDetail = ({ friend, userid }) => {
  const { id, username } = friend;

 const Function = () => {
   if (id != 0) {
     Alert.alert(
       'Delete Friend?',
       'Are you sure?',
       [
         {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
         {
           text: 'Yes', onPress: () => {
             fetch('http://triangle.bulme.at/~pi/MainAPI/Settings/DeleteFriend.php',
               {
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
                 Alert.alert(responseJson.toString());
                 Actions.Flist()
               }).done();
           }},],)}}
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

export default FriendDetail;

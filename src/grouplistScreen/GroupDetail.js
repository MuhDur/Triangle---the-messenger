import React from 'react';
import {Alert} from 'react-native';
import {Actions} from "react-native-router-flux";
import Card from './Card';
import CardSection from './CardSection';
import Button from './Button';



const GroupDetail = ({ group, userid }) => {
  const { name, id } = group;

 const Function = () => {
   if (id != 0) {
     Alert.alert(
       'Leave Group?',
       'Are you sure?',
       [
         {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
         {
           text: 'Yes', onPress: () => {
             fetch('http://triangle.bulme.at/~pi/MainAPI/Settings/LeaveGroup.php',
               {
               method: 'POST',
               headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify({

                 userid: userid,
                 groupid: id,

               })
             }).then(response => response.json())
               .then((responseJson) => {
                 Alert.alert(responseJson.toString());
                 Actions.Glist()
               }).done();
           }},],)}}
  return (
    <Card>
      <CardSection>
        <Button
        title = {name}
        Function = {Function}
        />
      </CardSection>
    </Card>
  );
};

export default GroupDetail;

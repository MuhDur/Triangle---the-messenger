import React, { Component } from 'react';
import {Alert, Text} from 'react-native';
import 'whatwg-fetch';
import { Actions } from 'react-native-router-flux';

import Card from  './createGroupScreen/Card';
import CardSection from  './createGroupScreen/CardSection';
import Button from  './createGroupScreen/Button';
import Input from  './createGroupScreen/Input';


class CreateGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      groupid: this.props.groupid,
      friendstemp: '',
      friendid: 0,
    };


  }
  componentWillMount() {

  };

  FunctionAdd = () => {
    fetch('http://triangle.bulme.at/~pi/MainAPI/Settings/GetUserID.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        username: this.state.friendstemp,

      })
    }).then((response) => response.json())
      .then((responseJson) => {
        let uid_temp = parseInt(responseJson, 10);
        this.setState({friendid: uid_temp}, () => {
          fetch('http://triangle.bulme.at/~pi/MainAPI/Settings/AddFriendGroup.php', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({

              groupid: this.state.groupid,
              friendid: this.state.friendid,

            })
          }).then(response => response.json())
            .then((responseJson) => {
              Alert.alert(responseJson.toString());
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
            onChange={(friendstemp) => this.setState({friendstemp})}
            text = "User"
          />
        </CardSection>
        <CardSection>
          <Button
            Function = {this.FunctionAdd}
            title = "Add User to the Group"
          />
        </CardSection>
        <CardSection>
        <Button
          Function = {Actions.main}
          title = "Create Group"
        />
      </CardSection>
      </Card>

    );
  }
}

export default CreateGroup;
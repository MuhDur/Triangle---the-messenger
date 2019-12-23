import React, { Component } from 'react';
import { ScrollView, View, Text, Alert, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { CheckBox } from 'native-base';
import AButton from 'react-native-micro-animated-button';
import { Actions } from 'react-native-router-flux';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import Realm from 'realm';
import { Card, CardItem, ConfirmModal } from '../common';
import UserList from './UserList';
//import { UserData } from '../GlobalUserData';

let EG_ID = '';
//const USERID = UserData.USERID;

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

class EventVote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.event.name,    // props
            anlass: this.props.event.anlass,
            typ: this.props.event.typ,
            address: this.props.event.address,
            eventid: this.props.event.id,
            managerid: this.props.event.manager_id,
            userid: '',
            mysqlquestions: [],
            questions: [],
            disableButton: false,
            confirmButtonTitle: 'Bestätigen',
            userSubmitted: false,
            results: [],
            userCount: 0,
            voteCount: 0,
            progressValue: 0,
            showUsers: false,
            users: [],
            buttonLeaveDisabled: false,
            showModal: false
        };
    }

    componentWillMount() {
      // realm
      Realm.open({
        schema: [MessageSchema,UserSchema]
      }).then(realm => {
        let result = realm.objects('userdata');
        this.setState({ userid: result[0].userid }, () => { // state gleich gesetzt
        });
      }).then(() => {
        this.checkIfUserSubmit();       // überprüfen, ob user bestätigt hat
        this.fetchEventQuestions();     // die Termin-Auswahl holen, um sie anzuzeigen
        this.showEventUsers();
      });

    }

    showEventUsers = () => {
        // fetch all event users
        let tempUsers = [];
        let usersWhoVoted = [];
        fetch('http://triangle.bulme.at/~pi/EveAPI/EventVote/fetchusers.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventid: this.state.eventid
            })
        }).then((response) => response.json())
            .then((responseData) => {
                tempUsers = responseData;
                this.setState({ userCount: responseData.length });
            }).then(() => {
            fetch('http://triangle.bulme.at/~pi/EveAPI/EventVote/fetchuserswhovoted.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventid: this.state.eventid
                })
            }).then((response) => response.json())
                .then((responseData) => {
                    usersWhoVoted = responseData;
                    this.setState({ voteCount: responseData.length });
                }).then(() => {
                  // wir haben zwei Arrays, einmal mit allen Users, und einmal mit Usern die gevotet haben
                  // und die counts
                  // wenn es 2 user gibt -> Progress geht von 0 bis 1
                  // 4 User beim Event heißt 4 ist gleich 1 (100%)
                  // 1/4 wäre eine Stimme dann Wert
                const voteCount = this.state.voteCount;
                const userCount = this.state.userCount;
                let userWorth = 1 / userCount;
                let progressValue = userWorth * voteCount;
                this.setState({ progressValue });           // progressValue: progressValue

                fetch('http://triangle.bulme.at/~pi/EveAPI/EventVote/getmanagergroupid.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        eventid: this.state.eventid,
                        managerid: this.state.managerid
                    })
                }).then((response) => response.json())
                    .then((responseData) => {
                        const managerArray = responseData;
                        let users = [];
                        let noVotes = false;
                        if (usersWhoVoted.length === 0) {
                            noVotes = true;
                        }

                        // zerstörer-FOR
                        for (let i = 0; i < tempUsers.length; i++) {
                            let newObj = {
                                id: tempUsers[i].id,
                                name: tempUsers[i].name,
                                surname: tempUsers[i].surname,
                                voted: false,
                                manager: false
                            };
                            users = users.concat(newObj);

                            if (noVotes === false) {
                                for (let m = 0; m < usersWhoVoted.length; m++) {
                                    if (tempUsers[i].id === usersWhoVoted[m].eventgroup_id) {
                                        users[i].voted = true;
                                    }
                                }
                            }

                            if (tempUsers[i].id === managerArray[0].id) {
                                users[i].manager = true;
                            }
                        }
                        this.setState({ users });
                    });
                });
            });
    }

    checkIfUserSubmit = () => {
        let checkConditionArray = [];
        fetch('http://triangle.bulme.at/~pi/EveAPI/EventVote/checkifusersubmit.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: this.state.userid,
                eventid: this.state.eventid
            })
        }).then((response) => response.json())
            .then((responseData) => {
                checkConditionArray = responseData;
        }).then(() => {
            if (checkConditionArray.length !== 0) {         // STATT .id WAS BESSERES EINFALLEN LASSEN
                this.setState({ userSubmitted: true, disableButton: true, confirmButtonTitle: 'Bestätigt' });
                this.buttonSubmit.success();
            } else {
                return;
            }
        });
    }

    fetchEventQuestions = () => {
        fetch('http://triangle.bulme.at/~pi/EveAPI/EventVote/showeventquestions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventid: this.state.eventid
            })
        }).then((response) => response.json())
            .then((responseData) => {
                this.setState({ mysqlquestions: responseData });
            }).then(() => {
            for (let i = 0; i < this.state.mysqlquestions.length; i++) {
                const newmysqldate = {
                    id: this.state.mysqlquestions[i].id,
                    question: moment(this.state.mysqlquestions[i].question).format('DD.MM.YYYY, HH:mm:ss'),
                    checked: false
                };
                this.setState({ questions: this.state.questions.concat(newmysqldate) });
            }
        })
            .then(
            () => this.fetchResults()
        );
    }

    fetchResults = () => {
      let tempResults = [];
        fetch('http://triangle.bulme.at/~pi/EveAPI/EventVote/fetchresults.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventid: this.state.eventid
            })
        }).then((response) => response.json())
            .then((responseData) => {
            tempResults = responseData;
        }).then(() => {
            const results = tempResults;

            let compressed = [];                // Hilfsvariable
            for (let i = 0; i < tempResults.length; i++) {
                let countDuplicate = 0;
                for (let m = 0; m < results.length; m++) {
                    if (tempResults[i].question_id === results[m].question_id) {
                        countDuplicate++;
                    }
                }

                if (countDuplicate > 0) {
                    const newCount = {
                        id: tempResults[i].question_id,
                        count: countDuplicate,
                        question: ''
                    };
                    compressed = compressed.concat(newCount);
                }
            }

            /*
                http://www.jstips.co/en/javascript/deduplicate-an-array/
            */

            let compressedObj = {};
            let finalComp = [];
            finalComp = compressed.filter((el) => {               // el...element
                let key = JSON.stringify(el);
                let match = Boolean(compressedObj[key]);

                return (match ? false : compressedObj[key] = true);
            });

            this.setState({ results: finalComp });

            let tmpResults = this.state.results;
            for (let i = 0; i < this.state.questions.length; i++) {
                for (let m = 0; m < this.state.results.length; m++) {
                    if (this.state.questions[i].id === this.state.results[m].id) {
                        tmpResults[m].question = this.state.questions[i].question;
                    }
                }
            }
            this.setState({ results: tmpResults });

            //console.log('look at this (compressed):', compressed, 'and this (comp):', comp);      funktioniert! er entfernt alle doppelten Einträge die Funktion oben

            // jetzt die question reinladen ins objekt array
        });
    }

    handleQuestionChecked(question) {
        let questions = this.state.questions;
        if (this.state.typ === 'multiple') {
            for (let i = 0; i < questions.length; i++) {
                if (question.id === questions[i].id) {
                    questions[i].checked = !questions[i].checked;     // false zu true, true zu false, alles kann man wählen
                }
            }

            this.setState({ questions });
        } else if (this.state.typ === 'single') {
            for (let i = 0; i < questions.length; i++) {
                questions[i].checked = false;        // schon gewählt? -> löschen -> neu wählen/setzen -> nur 1 darf gesetzt sein -> single
                if (question.id === questions[i].id) {
                    questions[i].checked = !questions[i].checked;
                }
            }

            this.setState({ questions });
        }
    }

    submitAnswers() {
        let Answered = false;
        for (let i = 0; i < this.state.questions.length; i++) {
            if (this.state.questions[i].checked === true) {
                Answered = true;
            }
        }

        // eventgroup_id über die eventid holen
        if (Answered === true) {
            let answers = this.state.questions;
            //let eventgroupid = '';
            answers = answers.filter((a) => a.checked === true);

            fetch('http://triangle.bulme.at/~pi/EveAPI/EventVote/fetcheventgroupid.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: this.state.userid,
                    eventid: this.state.eventid
                })
            }).then((response) => response.json())
                .then((responseData) => {
                    let Array = [];
                    Array = responseData;
                    EG_ID = Array[0].id;
                }).then(() => {
                for (let i = 0; i < answers.length; i++) {
                    fetch('http://triangle.bulme.at/~pi/EveAPI/EventVote/submitanswers.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userid: this.state.userid,
                            eventid: this.state.eventid,
                            answer: answers[i].id,           // alle antworten in FOR reinladen
                            eventgroupid: EG_ID
                        })
                    });
                }
                this.buttonSubmit.success();
                this.showEventUsers();      // zeige progress an

                this.fetchEventQuestions();
                this.setState({ userSubmitted: true });
            });
            // this.setState ist asynchron, und erzwingt manchmal ein rerender, aber weil es asynchron ist, ist this.state nicht updadet
            // es mutiert den state nicht gleich/direkt -> this.state = ... ist verboten -> nicht state direkt mutieren!
            // stattdessen lieber callback funktion verwenden

            // antworten reingeladen
            // jetzt Button Bestätigen grau machen, das man es nicht wieder betätigen kann
            //this.setState({ disableButton: true, confirmButtonTitle: 'Bestätigt' });


        } else {
            this.buttonSubmit.error();
            Alert.alert(
                'Bestätigen',
                'Du musst zuerst wählen!',
                [
                    { text: 'OK', onPress: () => { this.buttonSubmit.reset(); Actions.refresh(); } }
                ]
            );
        }
    }

    leaveEvent() {
        // raushauen, also aus eventgroup
        this.setState({ buttonLeaveDisabled: true, showModal: false });
        fetch('http://triangle.bulme.at/~pi/EveAPI/EventVote/fetcheventgroupid.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: this.state.userid,
                eventid: this.state.eventid
            })
        }).then((response) => response.json())
            .then((responseData) => {
                let Array = [];
                Array = responseData;
                EG_ID = Array[0].id;
            }).then(() => {
              fetch('http://triangle.bulme.at/~pi/EveAPI/EventVote/userleavingevent.php', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      eventgroupid: EG_ID
                  })
              }).then(() => { Actions.pop({ refresh: { refresh: Math.random() } }); });
            });

    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    renderQuestions() {
        return this.state.questions.map(question =>
            <View key={question.id} style={{ flexDirection: 'row' }}>
                <Text style={styles.questionsStyle}>{question.question}</Text>
                <CheckBox
                    color={'#2c3e50'}
                    checked={question.checked}
                    onPress={this.handleQuestionChecked.bind(this, question)}
                    style={{ paddingBottom: 5 }}
                />
            </View>
        );
    }

    renderQuestionsWithResult() {
        return this.state.results.map(result =>
            <View key={result.id} style={{ flexDirection: 'row' }}>
                <Text style={styles.questionsStyle}>{result.question}</Text>
                <Text style={styles.countStyle}>{result.count}</Text>
            </View>
        );
    }

    renderUsers() {
        return this.state.users.map(user =>
            <UserList key={user.id} name={user.name} surname={user.surname} voted={user.voted} manager={user.manager} />
        );
    }

    renderLeaveButton() {
        if (this.state.managerid == this.state.userid) {
            return;
        }

        return (
            <TouchableOpacity
                style={{ marginTop: 10 }}
                disabled={this.state.buttonLeaveDisabled}       // für manager disabled
                onPress={() => this.toggleModal()}
            >
                <Text style={{ color: 'rgba(0,0,0,0.8)' }}>Event verlassen</Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <ScrollView style={{ paddingTop: 15 }}>
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.titleStyle}>{this.state.name}</Text>
                    <Text style={styles.subtitleStyle}>{this.state.anlass}</Text>
                    <Text style={styles.placeStyle}>{this.state.address}</Text>
                </View>

                <Card>
                    {
                        this.state.userSubmitted === false &&
                        <View>
                            <CardItem>
                                <Text style={styles.textStyle}>Auswahl:</Text>
                            </CardItem>
                            <View style={{ flexDirection: 'column' }}>
                                {this.renderQuestions()}
                            </View>
                        </View>
                    }
                    {
                        this.state.userSubmitted === true &&
                        <View>
                            <CardItem>
                                <Text style={styles.textStyle}>Ergebnisse:</Text>
                            </CardItem>
                            <View style={{ flexDirection: 'column' }}>
                                {this.renderQuestionsWithResult()}
                            </View>
                        </View>
                    }
                </Card>

                <View style={{ alignItems: 'center', paddingTop: 5, justifyContent: 'center' }}>
                    <AButton
                        foregroundColor="rgb(255,255,255)"
                        label="Bestätigen"
                        labelStyle={{ color: 'rgba(255,255,255, 0.9)', fontSize: 18 }}
                        onPress={() => this.submitAnswers()}
                        ref={ref => (this.buttonSubmit = ref)}
                        successIconName="check"
                        scaleOnSuccess
                        successIconColor="rgb(255,255,255)"          // #4cd964
                        shakeOnError
                        errorColor='red'
                        errorIconName="warning"
                        style={{ backgroundColor: '#00B15E', width: 300, height: 50, marginTop: 8 }}
                        iconSize={20}
                    />
                </View>

                <View style={{ alignItems: 'center', paddingTop: 20 }}>
                    <Text style={[styles.textStyle, { paddingBottom: 5 }]}>Fortschritt:</Text>
                    <Progress.Bar progress={this.state.progressValue} width={300} height={10} />
                    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                        <Text style={{ color: 'black' }}>
                          {this.state.voteCount} von {this.state.userCount} haben gewählt!
                        </Text>
                    </View>

                    <Button
                        buttonStyle={{ backgroundColor: '#00B15E', width: 200, marginTop: 8 }}
                        fontSize={18}
                        title='Teilnehmer'
                        onPress={() => this.setState({ showUsers: !this.state.showUsers })}
                    />
                    {
                        this.state.showUsers &&
                        <View>
                            {this.renderUsers()}
                        </View>
                    }

                    {this.renderLeaveButton()}

                    <ConfirmModal
                        visible={this.state.showModal}
                        event={this.state.name}
                        onBackButtonPress={() => this.setState({ showModal: false })}
                        onBackdrop={() => this.setState({ showModal: false })}
                        onSwipe={() => this.setState({ showModal: false })}
                        onAccept={() => this.leaveEvent()}
                        onDecline={() => this.setState({ showModal: false })}
                        todo="verlassen"
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = {
    titleStyle: {
        fontSize: 25,
        color: 'rgba(0, 0, 0, 1)'
    },
    subtitleStyle: {
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.9)'
    },
    textStyle: {
        fontSize: 18,
        color: 'rgba(0, 0, 0, 0.9)'
    },
    questionsStyle: {
        fontSize: 15,
        color: 'rgba(0, 0, 0, 0.9)',
        paddingBottom: 5,
        paddingLeft: 20
    },
    countStyle: {
        fontSize: 15,
        color: 'rgba(0, 0, 0, 0.9)',
        paddingBottom: 5,
        paddingLeft: 40
    },
    placeStyle: {
        fontSize: 15,
        color: 'rgba(0, 0, 0, 0.9)',
        marginTop: 3,
        marginBottom: 4
    }
};


export default EventVote;

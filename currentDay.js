import React from 'react';
import {
  Alert,
  Platform, 
  Button, 
  Text,
  TextInput, 
  StyleSheet, 
  View, 
  TouchableWithoutFeedback, 
  Dimensions, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import CreatButton from './Button';
import base64 from 'base-64';
import {
  createAppContainer,
  DrawerNavigator,
  HeaderNavigationBar,
  StackNavigator,
} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import Logactivity from './Logactivity';
import Meals from './Meals';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import moment from "moment";

class currentDay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      userProfile: {},
      userActivity: [],
      totalWorkCalorie: "",
      totalCalorie: "",
      accesscode: "",
      errorMessage: "",
      showProfile: false,
      totalCalorie: 0, 
      totalCarbo:  0,
      totalFat: 0,
      totalProtein: 0,
      meallist: {},
      mealtimelist: {},
      meals: {},
      currentViewDate: moment().startOf('day'),
      texttodisplay: "Current Day Summary",
      leftArrow: 'tomato',
      rightArrow: 'gray'
    }
  }
  

  componentDidMount() {
    // On mount, do the first update
    this.updateFromApi(); // Function that updates component from fetch
    // Subscribe that same function to focus events on the component in the future
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
       this.updateFromApi();
    });
   }
   
  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }


  updateFromApi() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", this.props.screenProps.accesscode);
    
    
    
    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow', 
    };

    
    let totalWorkDur = 0;
    let totalCalorie = 0;
    let tempTotalCalries = 0;
    let tempTotalProteins = 0;
    let tempTotalFat = 0;
    let tempTotalCarbo = 0;
    let alreadyset = false;
    
    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.screenProps.username, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.setState({userProfile: result});
        this.setState({errorMessage: result.message});
      })
      .then(fetch('https://mysqlcs639.cs.wisc.edu/activities', requestOptions)
        .then(response2 => response2.json())
        .then(result2 => {
          this.setState({userActivity: result2.activities});
          this.setState({errorMessage: result2.message});
          
          

          for (let singleAct of this.state.userActivity) {
            if (moment(singleAct.date).format('DD-MM-YYYY') === moment(this.state.currentViewDate).format('DD-MM-YYYY')) {
                totalWorkDur += singleAct.duration;
                totalCalorie += singleAct.calories;
            }
            
          }
          this.setState({totalWorkTime: totalWorkDur, totalWorkCalorie: totalCalorie});
          fetch('https://mysqlcs639.cs.wisc.edu/meals', requestOptions)
            .then(response3 => response3.json())
            .then(result3 => {
          
            let timelist = {};
            let foodlist = {};

            
            for (let i = 0 ; i < result3.meals.length; i++) {
                let meal = result3.meals[i];
                if (moment(meal.date).format('DD-MM-YYYY') === moment(this.state.currentViewDate).format('DD-MM-YYYY')) {
                    fetch('https://mysqlcs639.cs.wisc.edu/meals/' + meal.id + '/foods', requestOptions)
                    .then(response4 => response4.json())
                    .then(result4 => {
                        let tempfood = {};
                        tempfood.id = meal.id;
                        tempfood.name = meal.name;
                        tempfood.date = meal.date;
                        tempfood.foods = result4.foods;
                        foodlist[meal.id] = JSON.parse(JSON.stringify(tempfood));
                        timelist[meal.id] = meal.date;
                        this.setState({meallist: foodlist});
                        this.setState({mealtimelist: timelist});


                        for (let food of result4.foods) {
                            tempTotalCalries += JSON.parse(JSON.stringify(food.calories));
                            tempTotalCarbo += food.carbohydrates;
                            tempTotalFat += food.fat;
                            tempTotalProteins += food.protein;
                        }
                        // calorieslist[meal.id] = tempTotalCalries;
                        // proteinlist[meal.id] = tempTotalProteins;
                        // fatlist[meal.id]= tempTotalFat;
                        // carbolist[meal.id] = tempTotalCarbo;

                        alreadyset = true;
                        // console.log(tempTotalCalries)
                        this.setState({
                            totalCalorie: tempTotalCalries, 
                            totalCarbo:  tempTotalCarbo,
                            totalFat: tempTotalFat,
                            totalProtein: tempTotalProteins
                        })
                    })


                }
                
            this.setState({meals: result3.meals})
            }
        })  
        if (alreadyset === false) {
            
            this.setState({
                totalCalorie: tempTotalCalries, 
                totalCarbo:  tempTotalCarbo,
                totalFat: tempTotalFat,
                totalProtein: tempTotalProteins
            })
        }
    
        })
        
        .catch(error => this.setState({errorMessage: "hellosdasd"}))
      )
      .catch(error => this.setState({errorMessage: "hellosdasd"}));
    //   console.log(tempTotalCalries);
      
  }
  
  static navigationOptions = {
      title: 'Current Day',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name={Platform.OS === "ios"?"ios-calendar":"md-calendar" } size={25} color={tintColor}/>
      )
  };
  
  decreaseDate() {
      let currentDay = moment(this.state.currentViewDate).subtract(1, 'day').startOf('day');
      if ( moment().startOf('day').diff(currentDay, 'days') < 7 ) {
        this.setState({currentViewDate: currentDay});
        this.setState({texttodisplay: currentDay.format('MMMM Do YYYY')})
        this.setState({rightArrow: 'tomato'});
        this.updateFromApi();
    }  
      else if ( moment().startOf('day').diff(currentDay, 'days') === 7 ) {
        this.setState({currentViewDate: currentDay});
        this.setState({texttodisplay: currentDay.format('MMMM Do YYYY')});
        this.setState({rightArrow: 'tomato'});
        this.setState({leftArrow: 'gray'});
        this.updateFromApi();
      }
  }

  increaseDate() {
    let currentDay = moment(this.state.currentViewDate).add(1, 'day').startOf('day');
    if ( moment().startOf('day').diff(currentDay, 'days') > 0 ) {
      this.setState({currentViewDate: currentDay});
      this.setState({texttodisplay: currentDay.format('MMMM Do YYYY')})
      this.setState({leftArrow: 'tomato'});
      this.updateFromApi();
  }  
    else if ( moment().startOf('day').diff(currentDay, 'days') === 0 ) {
      this.setState({currentViewDate: currentDay});
      this.setState({texttodisplay: "Current Day Summary"});
      this.setState({rightArrow: 'gray'});
      this.setState({leftArrow: 'tomato'});
      this.updateFromApi();
    }
}
  
    
  render() {
    return (
        <ScrollView>
            <View style={{flex: 1,  flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Ionicons style={{marginTop: 5}} name={Platform.OS === "ios"?"ios-arrow-dropleft-circle":"md-arrow-dropleft-circle" } size={25} color={this.state.leftArrow} onPress={() => this.decreaseDate()}/> 
                <Text  style={[styles.sectionHeading, {marginLeft: 15, marginRight: 15}]} >{this.state.texttodisplay}</Text>
                <Ionicons style={{marginTop: 5}} name={Platform.OS === "ios"?"ios-arrow-dropright-circle":"md-arrow-dropright-circle" } size={25} color={this.state.rightArrow} onPress={() => this.increaseDate()}/> 
            </View>

          <Card title="Activty" containerStyle={{backgroundColor: '#a1bbd6', borderRadius: 10}} dividerStyle={{backgroundColor: 'black'}}>
            <View  style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ width: 260}}>
                Work Out Duration: 
              </Text>
              <Text>
                {this.state.totalWorkTime} min
              </Text>
            </View>
            <View  style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ width: 260}}>
                Calories:  
              </Text>
              <Text>
                {this.state.totalWorkCalorie} kcal
              </Text>
            </View>
          </Card>

          <Card title="Nutrition" containerStyle={{backgroundColor: '#76a66d', borderRadius: 10}} dividerStyle={{backgroundColor: 'black'}}>
            <View  style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ width: 260}}>
                Calories: 
              </Text>
              <Text>
                {this.state.totalCalorie}  kcal
              </Text>
            </View>
            <View  style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ width: 260}}>
                Protein:  
              </Text>
              <Text>
                {this.state.totalProtein}  g
              </Text>
            </View>
            <View  style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ width: 260}}>
                Carbohydrates:  
              </Text>
              <Text>
                {this.state.totalCarbo}  g
              </Text>
            </View>
            <View  style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ width: 260}}>
                Fat:  
              </Text>
              <Text>
                {this.state.totalFat}  g
              </Text>
            </View>
          </Card>

          <Card title="Your Goals" containerStyle={{backgroundColor: '#999e96', borderRadius: 10}} dividerStyle={{backgroundColor: 'black'}}>
            <View  style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ width: 260}}>
                Activity:  
              </Text>
              <Text>
                {this.state.userProfile.goalDailyActivity} min
              </Text>
            </View>
            <View  style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ width: 260}}>
                Calories: 
              </Text>
              <Text>
                {this.state.userProfile.goalDailyCalories} kcal
              </Text>
            </View>
            <View  style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ width: 260}}>
                Protein:  
              </Text>
              <Text>
                {this.state.userProfile.goalDailyProtein} g
              </Text>
            </View>
            <View  style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ width: 260}}>
                Carbohydrates:  
              </Text>
              <Text>
                {this.state.userProfile.goalDailyCarbohydrates} g
              </Text>
            </View>
            <View  style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ width: 260}}>
                Fat:  
              </Text>
              <Text>
                {this.state.userProfile.goalDailyFat} g
              </Text>
            </View>
          </Card>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    paddingBottom: 10,
    
  },
  story: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: '100%',
    padding: 10,
    backgroundColor: 'gray'
  },
  sectionHeading: {
    margin: 8,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#116bd1',
  },
  storyHeading: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
  },
});


export default currentDay;

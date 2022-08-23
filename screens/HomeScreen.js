import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { Pressable, Modal, Keyboard, FlatList, StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Button, Alert, Image, Animated, StatusBar, Dimensions} from 'react-native';
import { auth } from '../firebase'
import { ref, set, onValue, update } from 'firebase/database'
import { db } from '../firebase'
import { apiKey } from '../apiKey'

const HomeScreen = () => {

  let url = 'https://api.themoviedb.org/3/movie/popular?api_key=309cb313540efb5b0ad617883f8756af&language=en-US&page=1';

  const [fetchedData, setFetchedData] = useState("");
  const [selectedData, setSelectedData] = useState("");
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [fireData, setFireData] = useState("");
  let temp = []

  const [uid, setUid] = useState('');
  const [favouriteIcon, setFavouriteIcon] = useState(require('../assets/full_heart.png'));

  let path = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((actualData) => processData(actualData))
      .catch((err) => {
       console.log(err.message);
    });
  }, []);

  useEffect(() => {
    return onValue(ref(db, '/users'), snapshot => {
      let data = snapshot.val();
      const user = auth.currentUser;
      setUid(user.uid);

      console.log("Initial login");
      console.log("uid: ", user.uid);
      if (data !== null) {
        setFireData(data[user.uid]);
        console.log("exist fireData: ", data[user.uid]);
      }
    });
  }, []);

  const processData = (arr) => {
    temp = arr["results"];
    let dataArr = temp.slice(0,5);
    console.log(dataArr);
    let arr1 = [];
    dataArr.forEach((element) => {
      arr1.push({"title": element.title, "image": element.poster_path});
    });

    let newArr = arr1.filter(function (el)
    {
      return el.title != undefined;
    });
    console.log('newArr: ',newArr);

    setFetchedData(newArr);
  }

  const showList = (title) => {
    let url = "https://www.omdbapi.com/?";
    fetch(url+apiKey+'&t='+title)
      .then((response) => response.json())
      .then((actualData) => setSelectedData(actualData))
      .then(console.log("$$$$$$$$$$$$$$$$$",selectedData))
      .catch((err) => {
       console.log(err.message);
    });

    setSelectModalVisible(true);
  }

  const updateList = (value) => {
    console.log("update: ", value);
    update(ref(db, 'users/' + uid), {
      favouriteList: value,
    }).then(() => {
      alert('Favourite saved!');
    })
    .catch((error) => {
      alert(error);
    });

  }

  const reload =() =>{
    return onValue(ref(db, '/users'), snapshot => {
      let data = snapshot.val();
      const user = auth.currentUser;
      setUid(user.uid);

      console.log("RELOAD");
      console.log("uid: ", user.uid);
      if (data !== null) {
        setFireData(data[user.uid]);
        console.log("exist fireData: ", data[user.uid]);
      }
    });
  }

  const favourite = () =>{
    console.log("FIREDATA", fireData);
    if (fireData === undefined || fireData === null){
      console.log("FIREDATA is undefined");
    } else {
      temp = fireData["favouriteList"];
    }
    console.log("LOOK HERE", temp);
    temp.push({"title": selectedData.Title, "imdbID": selectedData.imdbID});
    console.log("temp PUSHED: ",temp);
    updateList(temp);
  }

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "100%",
          backgroundColor: "#DEE4E7",
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchLabel}>
        <Text style={styles.textStyle}>Trending Top 5 movies</Text>
      </View>
      <View style={styles.flContainer}>
        <FlatList
          data = {fetchedData}
          renderItem={({item}) =>
            <View styles={{flex:1, flexDirection:'row',}}>
              <TouchableOpacity onPress={showList.bind(this, item.title)}>
                <Image
                  source = {{uri: path+item.image}}
                  style={styles.imageView}
                  onLoad={() =>{console.log("loaded")}}
                  />
              </TouchableOpacity>
            </View>
          }
          ListEmptyComponent = {<Text>Its empty...</Text>}
          ItemSeparatorComponent={renderSeparator}
          />
      </View>

      <View style={styles.centeredView1}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setSelectModalVisible(!selectModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.headerView}>
                <Pressable
                  style={styles.button}
                  onPress={() => setSelectModalVisible(!selectModalVisible)}
                >
                  <Text style={styles.textStyle}>X</Text>
                </Pressable>
                <Text style={styles.headerText}>Movie Synopsis</Text>
              </View>

              <View style={styles.titleView}>
                <Text style={styles.textStyle}>{selectedData.Title}</Text>
                <TouchableOpacity style={styles.heartIcon} onPress={() => favourite()}>
                  <Image
                    source = {favouriteIcon}
                    style={styles.heartIconImage}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.infoView}>
                <View style={styles.infoViewRow}>
                  <Image
                    source = {{uri: selectedData.Poster}}
                    style={styles.imageStyle}
                    onLoad={() =>{console.log("loaded")}}
                    />
                  <View style={styles.infoViewColumn}>
                    <View style={styles.infoViewColumn}>
                      <Text style={styles.textStyle}>Rated:</Text>
                      <Text style={styles.textStyle2}>{selectedData.Rated}</Text>

                      <Text style={styles.textStyle}>Release:</Text>
                      <Text style={styles.textStyle2}>{selectedData.Released}</Text>

                      <Text style={styles.textStyle}>Genre:</Text>
                      <Text style={styles.textStyle2}>{selectedData.Genre}</Text>

                      <Text style={styles.textStyle}>Cast:</Text>
                      <Text style={styles.textStyle2}>{selectedData.Actors}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.plotView}>
                  <Text style={styles.textStyle}>Plot:</Text>
                  <Text style={styles.textStyle2}>{selectedData.Plot}</Text>
                </View>

              </View>
            </View>
          </View>
        </Modal>
      </View>

    </SafeAreaView>
  )
}

export default HomeScreen

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"#DEE4E7",
    marginTop:StatusBar.currentHeight,
  },

  flContainer: {
    backgroundColor:"#DEE4E7",
  },


  searchLabel: {
    backgroundColor:"#DEE4E7",
    textAlign: "center",
    justifyContent: "center",
    width: 400,
    height: 50,
    marginTop: 20,
    marginLeft: 20,
  },

  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 20,
  },

  input: {
    height: 50,
    width: windowWidth-80,
    marginTop: 10, marginRight: 5, marginLeft:10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5'
  },

  searchIcon: {
    height: 50,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchIconImage: {
    width:35,
    height:35,
  },

  heartIcon: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: 18,
  },

  heartIconImage: {
    width:30,
    height:30,
    resizeMode: "cover",
    marginBottom: 18,
  },

  rowAlign: {
    flexDirection: "row",
    margin:5,
  },

  cell: {
      padding: 10,
      fontSize: 18,
      height: 44,
  },

  centeredView1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth-20,
    height: windowHeight-20,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: 'wrap',
  },
  modalView: {
    margin: 20,
    backgroundColor: "#909090",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },

  headerView: {
    flexDirection: 'row-reverse',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 30,
    fontWeight: 'bold',
  },

  button: {
    alignItems: 'center',
    marginLeft: 150,
  },

  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "left",
    fontSize:20,
    flexWrap: 'wrap',
  },

  headerText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize:25,
  },

  infoView: {
    flex:10,
  },

  infoViewRow: {
    flexDirection: 'row',
  },

  titleView: {
    flexDirection: 'row',
  },

  infoViewColumn: {
    flexDirection: 'column',
    flex:1,
    marginLeft: 10
  },

  textStyle2: {
    fontSize: 20,
    color: '#37474F',
  },

  imageStyle: {
    flex:1.2,
    width:100,
    height:300,
    resizeMode: "cover"
  },

  plotView: {
    flexDirection: 'column',
    marginTop: 20,
  },

  imageView: {
    flex:1.2,
    width:windowWidth,
    height:600,
    resizeMode: "cover"
  },
})

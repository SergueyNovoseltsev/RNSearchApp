import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useGetCharacterDetail,
  useGetEpisodeList,
  useGetLocation,
} from "./hooks/api/useGet";
import { Episode } from "./models/episode";
import { Character } from "./models/character";
import { Location } from "./models/location";

export default function Details() {
  const props = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(true);

  const { callApi: fetchCharacterDetail, data: characterDetailData } =
    useGetCharacterDetail(props.id.toString());
  const { callApi: fetchEpisodes, data: episodeListData } = useGetEpisodeList(
    characterDetailData?.episode
      ?.map((url: string) => {
        const lastSlashIndex = url.lastIndexOf("/");
        return url.slice(lastSlashIndex + 1);
      })
      .join(", ")
  );
  const { callApi: fetchLocation, data: locationDetailData } = useGetLocation(
    characterDetailData?.location?.link?.slice(
      characterDetailData?.location?.link?.lastIndexOf("/")
    )
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        fetchCharacterDetail();
        fetchEpisodes();
        fetchLocation();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [props.id]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {/* Character Details */}
      {characterDetailData && (
        <View style={styles.section}>
          <Text style={styles.title}>{characterDetailData.name}</Text>
          <Text>Gender: {characterDetailData.gender}</Text>
          <Text>Type: {characterDetailData.type}</Text>
          <Text>Status: {characterDetailData.status}</Text>
        </View>
      )}

      {episodeListData && episodeListData?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>
            Episodes where the character appears:
          </Text>
          <FlatList
            data={episodeListData}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.episodeItem}>
                <Text>{item.name}</Text>
                <Text>Episode: {item.episode}</Text>
              </View>
            )}
          />
        </View>
      )}

      {locationDetailData && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Last known location:</Text>
          <Text>Name: {locationDetailData.name}</Text>
          <Text>Dimension: {locationDetailData.dimension}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  episodeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
location;

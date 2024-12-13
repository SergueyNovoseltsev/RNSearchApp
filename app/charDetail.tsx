import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  useGetCharacterDetail,
  useGetEpisodeList,
  useGetLocation,
} from "./hooks/api/useGet";

export default function Details() {
  const props = useLocalSearchParams();

  const {
    callApi: fetchCharacterDetail,
    data: characterDetailData,
    isLoading,
  } = useGetCharacterDetail(props.id.toString());
  const { callApi: fetchEpisodes, data: episodeListData } = useGetEpisodeList(
    characterDetailData?.episode
      ?.map((url: string) => {
        const lastSlashIndex = url.lastIndexOf("/");
        return url.slice(lastSlashIndex + 1);
      })
      .join(", ")
  );
  const { callApi: fetchLocation, data: locationDetailData } = useGetLocation(
    characterDetailData?.location?.url?.slice(
      characterDetailData?.location?.url?.lastIndexOf("/")
    )
  );

  useEffect(() => {
    fetchCharacterDetail();
  }, [props.id]);

  useEffect(() => {
    if (characterDetailData) {
      fetchEpisodes();
      fetchLocation();
    }
  }, [characterDetailData]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {/* Character Details */}
      {characterDetailData && (
        <View style={styles.section}>
          <View style={styles.characterHeader}>
            <Image
              source={{ uri: characterDetailData.image }}
              style={styles.characterImage}
            />
            <View style={styles.characterInfo}>
              <Text style={styles.title}>{characterDetailData.name}</Text>
              <Text style={styles.detailText}>
                Gender: {characterDetailData.gender}
              </Text>
              <Text style={styles.detailText}>
                Type: {characterDetailData.type}
              </Text>
              <Text style={styles.detailText}>
                Status: {characterDetailData.status}
              </Text>
              <Text style={styles.detailText}>
                Species: {characterDetailData.species}
              </Text>
              <Text style={styles.detailText}>
                Origin: {characterDetailData.origin.name}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* List of episodes in which this character appeared */}
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
                <Text style={styles.episodeTitle}>{item.name}</Text>
                <Text>Episode: {item.episode}</Text>
              </View>
            )}
          />
        </View>
      )}

      {/* Last known location endpoint */}
      {locationDetailData && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Last known location:</Text>
          <Text style={styles.detailText}>Name: {locationDetailData.name}</Text>
          <Text style={styles.detailText}>Type: {locationDetailData.type}</Text>
          <Text style={styles.detailText}>
            Dimension: {locationDetailData.dimension}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  characterHeader: {
    flexDirection: "row",
    marginBottom: 15,
  },
  characterImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  characterInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#444",
  },
  detailText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  episodeItem: {
    width: 180,
    marginRight: 15,
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  episodeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  episodeTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
});

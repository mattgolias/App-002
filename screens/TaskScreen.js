import React, { useState } from "react";
import { ActivityIndicator, FlatList, Text, View, TextInput, Button } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CardTask } from "../components/CardTask";
import { getTasks, createTask, updateTask, deleteTask } from "../api/task";

export const TaskScreen = ({ navigation }) => {

  const queryClient = useQueryClient();
  const [newTaskText, setNewTaskText] = useState('');

  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
  console.log("data",data)

  const mutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.log('error', error);
    }
  });

   const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setNewTaskText('');
    },
  });

   const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleNewTaskTextChange = (text) => {
    setNewTaskText(text);
  };

  const handleCreateTask = () => {
    if (newTaskText.trim() !== '') {
      createTaskMutation.mutate({ description: newTaskText });
    }
  };  

  const handleDeleteTask = (objectId) => {
    deleteTaskMutation.mutate(objectId);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isFetching && <Text>IS FETCHING</Text>}
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1, width:100 }}
        onChangeText={handleNewTaskTextChange}
        value={newTaskText}
      />
     <Button title="Create Task" onPress={handleCreateTask} />
     <FlatList
        style={{ flex: 1 }}
        data={data.results}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item }) => (
          <CardTask
            task={item}
            navigation={navigation}
            taskDoneChange={mutation.mutate}
            onDeletePress={(objectId) => handleDeleteTask(objectId)}
          />
        )}
      />
    </View>
  );
};
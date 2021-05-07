export const getters = {
  getTaskIndex: state => (listIndex, id) => {
    const item = state.data.lists[listIndex].data.find(el => el._id === id)

    return state.data.lists[listIndex].data.indexOf(item)
  },
}

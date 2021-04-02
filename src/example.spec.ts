class FriendsList {
  friendsList = [];

  addFriend(name) {
    this.friendsList.push(name);
    this.announceFriendship(name);
  }

  announceFriendship(name) {
    global.console.log(name);
  }
}

// test
describe(('friends List'), () => {
  let friends;

  beforeEach(() => {
    friends = new FriendsList();
  });


  it('initialize Friends List',() => {
    expect(friends.friendsList.length).toEqual(0);
  });

  it('add a friend to the list', () => {
    friends.addFriend('Airial');
    expect(friends.friendsList.length).toEqual(1);
  })

  it('announce friendship', () => {
    friends.announceFriendship = jest.fn();
    friends.addFriend('hyunjin');
    expect(friends.announceFriendship).toHaveBeenCalled();
  })

})

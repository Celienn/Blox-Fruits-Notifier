module.exports = (client) => {
    console.log(`✅ ${process.env.CLIENT_NAME} logged !!`);
    client.user.setActivity("checking next stock")
};

export default {
  async fetch(request, env, ctx) {
    // You can view your logs in the Observability dashboard
    console.info({ message: 'Hello World Worker received a request!' }); 
    return Response.json({
      success: true,
      message: "Good Bro",
      data: {
        coins: 500,
        rank: "Admin",
        online: true
      }
    });
  }
};

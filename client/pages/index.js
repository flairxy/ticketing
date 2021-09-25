import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return (
    <div className="container">
      {currentUser ? (
        <h2>You are signed in</h2>
      ) : (
        <h2>You are not signed in</h2>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return { props: { ...data } };
}

export default LandingPage;

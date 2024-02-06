const SmellButton = ({ count }: { count: number }) => {
  return (
    <>
      {count >= 1000 ?
        (
          <p className="text-red-50">
            trent smells like beef and cheese
          </p>
        ) : (
          <p>
            trent smells like flowers and unicorns
          </p>
        )
      }
    </>
  );
};

export default SmellButton;

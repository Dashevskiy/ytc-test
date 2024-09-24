import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import '../styles/UserForm.css'; 

type User = {
  username: string;
  email: string;
};

const UserForm = () => {
  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors, isValid } 
  } = useForm({
    defaultValues: {
      users: [{ username: '', email: '' }],
    },
    mode: 'onChange',
  });
  
  const { fields, prepend, remove, insert } = useFieldArray({
    control,
    name: 'users',
  });

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        const users = data.map((user: any) => ({
          username: user.username,
          email: user.email,
        }));
        users.forEach((user: User) => prepend(user));
        setInitialDataLoaded(true);
      });
  }, [prepend]);

  const onSubmit = (data: any) => {
    console.log('Submitting data to server: ', data);
    fetch('/mock-save-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then(result => console.log('Result: ', result))
      .catch(error => console.error('Error: ', error));
  };

  return (
    <div className="container">
      <h2 className="title font">Users</h2>
      {initialDataLoaded ? (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <button type="button" onClick={() => prepend({ username: '', email: '' })} className="addNew font">Add New</button>
          {fields.map((field, index) => (
            <div key={field.id} className="row">
              <input
                {...register(`users.${index}.username`, { required: true })}
                defaultValue={field.username}
                placeholder="Username"
                className="input font"
              />
              <input
                {...register(`users.${index}.email`, { required: true })}
                defaultValue={field.email}
                placeholder="Email"
                className="input font"
              />
              <button type="button" onClick={() => insert(index + 1, { username: '', email: '' })} className="addAfter">Add after</button>
              <button type="button" onClick={() => remove(index)} className="delete font">Delete</button>
            </div>
          ))}
          <div className='saveBtn-container'>
            <button type="submit" disabled={!isValid} className="saveChanges font">Save Changes</button>
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserForm;

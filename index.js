import { ApolloServer, UserInputError,gql } from "apollo-server";
import {v1 as uuid} from 'uuid'
// const { ApolloServer } = require('apollo-server');

// Datos

const persons = [
  {
    name: "Juan Pérez",
    phone: "123-456-7890",
    street: "Calle Principal",
    city: "Ciudad A",
    id: "001",
  },
  {
    name: "María López",
    phone: "098-765-4321",
    street: "Avenida Secundaria",
    city: "Ciudad B",
    id: "002",
  },
  {
    name: "Carlos Rodríguez",
    street: "Calle Central",
    city: "Ciudad C",
    id: "003",
  },
];

//  Definir datos

const typeDefs = gql`
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    # Devuelve un entero
    personCount: Int!
    # Devuelve un array
    allPersons: [Person]!
    findPerson(name:String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
  }
`;

// De donde sacar los datos

const resolvers = {
  // Query general con el conteo, todas las personas y encontrar una persona por nombre
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => {
        const {name} = args
        return persons.find(person => person.name === name)
    },

  },
  // Mutation para añadir una persona y generarle un id
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find(p => p.name === args.name)) {
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name
        }) 
      };
      const person = { ...args, id: uuid() }
      persons.push(person) // En este caso asi, pero en bbdd sería diferente
      return person
    }
  },
  // Modificar las personas para que tengan un campo address con la calle y la ciudad
  Person: {
    address: (root) => {
        return {
            street: root.street,
            city: root.city
        }
    }
  }
};

// Servidor

const server = new ApolloServer({
    typeDefs,
    resolvers
})

// Iniciar servidor

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`)
}) 
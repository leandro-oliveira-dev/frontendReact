/* eslint-disable react-hooks/rules-of-hooks */
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { differenceInDays } from "date-fns";

import {
  Button,
  Thead,
  Tr,
  Td,
  Th,
  VStack,
  TableContainer,
  Table,
  Tbody,
  Box,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthProvider";

interface IUser {
  id: string;
  name: string;
  created_at: Date;
  enabled: boolean;
  auth: { ra: string };
}

export default function RelatorioEmprestar() {
  const { api } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<IUser[]>();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItens, setTotalItens] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    api
      .get(`/users/usuario-report/?page=${currentPage}&pageSize=${pageSize}`)
      .then((response) => response.data)
      .then((value) => {
        setUsers(value);
        setTotalItens(value.totalBooks);
        setTotalPages(value.totalPages);
        setHasPreviousPage(value.hasPreviousPage);
        setHasNextPage(value.hasNextPage);
      })
      .catch((error) => console.log(error));
  }, [api, currentPage, pageSize, router]);

  return (
    <Box as={"main"}>
      <Header title="Detalhes do Usuário"></Header>

      <VStack>
        <VStack>
          <TableContainer>
            <Table backgroundColor={"#222"} borderRadius={4} variant="simple">
              <Thead>
                <Tr>
                  <Th color={"#fff"}>RA</Th>
                  <Th color={"#fff"}>Nome</Th>
                  <Th color={"#fff"}>Data de criação</Th>
                  <Th color={"#fff"}>Dias do aluno no sistema</Th>
                  <Th color={"#fff"}>Status</Th>

                  <Th color={"#fff"}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {users?.map((user) => (
                  <Tr key={user.id}>
                    <Td>{user?.auth?.ra}</Td>
                    <Td>{user.name}</Td>
                    <Td>
                      {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </Td>
                    <Td>
                      {differenceInDays(new Date(), user.created_at)} dias
                    </Td>
                    <Td>{user.enabled ? "Ativo" : "Bloqueado"}</Td>

                    <Td>
                      <HStack>
                        <Button colorScheme="green">Desbloquear aluno</Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box width={"100%"}>
            <HStack justifyContent={"space-between"}>
              <span>
                {currentPage} de {totalPages}
              </span>
              <span> {totalItens} Total de Livros</span>
            </HStack>
            <HStack>
              {hasPreviousPage && (
                <Button
                  colorScheme="gray"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  anterior
                </Button>
              )}
              {hasNextPage && (
                <Button
                  colorScheme="gray"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  próximo
                </Button>
              )}
            </HStack>
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
}

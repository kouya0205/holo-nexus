import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

export function CardDetail({ cardDetail }: { cardDetail: any }) {
  switch (cardDetail.type) {
    case "holo":
      return (
        <div>
          <p className="border-none text-4xl font-bold text-[#534B88]">
            {cardDetail.card_name}
            <span className="text-base font-light pl-2">{cardDetail.card_number}</span>
          </p>
          <Table className="border-collapse">
            <TableBody>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="w-20 border-b-0 px-2 py-1 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-2 py-0.5 text-base font-light text-white">
                    カードタイプ
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 px-2 py-1">
                  <p className="text-base font-light text-[#534B88]">ホロメンカード</p>
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 px-2 py-1 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-2 py-0.5 text-base font-light text-white">
                    タグ
                  </Badge>
                </TableCell>
                <TableCell className="flex border-b-0 px-2 py-1">
                  {cardDetail.card_type.map((tag: any) => (
                    <p className="text-base font-light text-[#534B88]" key={tag.type_list.type_id}>
                      #{tag.type_list.type_name}
                    </p>
                  ))}
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 px-2 py-1 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-2 py-0.5 text-base font-light text-white">
                    Bloomレベル
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 px-2 py-1">
                  <p className="text-base font-light text-[#534B88]">{cardDetail.holomencards.debut_stage}</p>
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 px-2 py-1 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-2 py-0.5 text-base font-light text-white">
                    レアリティ
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 px-2 py-1">
                  <p className="text-base font-light text-[#534B88]">{cardDetail.rarity}</p>
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 px-2 py-1 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-2 py-0.5 text-base font-light text-white">
                    収録商品
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 px-2 py-1">
                  <p className="text-base font-light text-[#534B88]">{cardDetail.release_deck}</p>
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 px-2 py-1 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-2 py-0.5 text-base font-light text-white">
                    HP
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 px-2 py-1">
                  <p className="text-base font-light text-[#534B88]">{cardDetail.holomencards.hp}</p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    case "oshi-horo":
      return (
        <div>
          <p className="border-none text-4xl font-bold text-[#534B88]">{cardDetail.card_name}</p>
          <Table className="max-w-80 border-collapse">
            <TableBody>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 py-2 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-3 py-0 text-base font-light text-white">
                    カードタイプ
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 py-2">
                  <p className="text-base font-light text-[#534B88]">ホロメンカード</p>
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 py-2 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-3 py-0 text-base font-light text-white">
                    Bloomレベル
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 py-2">
                  <p className="text-base font-light text-[#534B88]">{cardDetail.oshiholomencards.debut_stage}</p>
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 py-2 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-3 py-0 text-base font-light text-white">
                    レアリティ
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 py-2">
                  <p className="text-base font-light text-[#534B88]">{cardDetail.rarity}</p>
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 py-2 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-3 py-0 text-base font-light text-white">
                    収録商品
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 py-2">
                  <p className="text-base font-light text-[#534B88]">{cardDetail.release_deck}</p>
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 py-2 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-3 py-0 text-base font-light text-white">
                    HP
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 py-2">
                  <p className="text-base font-light text-[#534B88]">{cardDetail.oshiholomencards.hp}</p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    case "buzz_holo":
      return (
        <div>
          <p className="border-none text-4xl font-bold text-[#534B88]">{cardDetail.card_name}</p>
          <Table className="border-collapse">
            <TableBody>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="w-20 border-b-0 px-2 py-1 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-2 py-0.5 text-base font-light text-white">
                    カードタイプ
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 px-2 py-1">
                  <p className="text-base font-light text-[#534B88]">Buzzホロメンカード</p>
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 px-2 py-1 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-2 py-0.5 text-base font-light text-white">
                    タグ
                  </Badge>
                </TableCell>
                <TableCell className="flex border-b-0 px-2 py-1">
                  {cardDetail.type_list.map((tag: any) => (
                    <p className="text-base font-light text-[#534B88]" key={tag.type_id}>
                      #{tag.type_name}
                    </p>
                  ))}
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 px-2 py-1 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-2 py-0.5 text-base font-light text-white">
                    Bloomレベル
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 px-2 py-1">
                  <p className="text-base font-light text-[#534B88]">{cardDetail.buzzholomencards.debut_stage}</p>
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 px-2 py-1 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-2 py-0.5 text-base font-light text-white">
                    レアリティ
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 px-2 py-1">
                  <p className="text-base font-light text-[#534B88]">{cardDetail.rarity}</p>
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 px-2 py-1 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-2 py-0.5 text-base font-light text-white">
                    収録商品
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 px-2 py-1">
                  <p className="text-base font-light text-[#534B88]">{cardDetail.release_deck}</p>
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell className="border-b-0 px-2 py-1 font-medium">
                  <Badge className="w-32 justify-center bg-[#534B88] px-2 py-0.5 text-base font-light text-white">
                    HP
                  </Badge>
                </TableCell>
                <TableCell className="border-b-0 px-2 py-1">
                  <p className="text-base font-light text-[#534B88]">{cardDetail.buzzholomencards.hp}</p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    case "support":
      return (
        <div>
          <p className="text-lg font-bold">Artifact</p>
          <p className="text-sm text-gray-500">Cost: {cardDetail.cost}</p>
        </div>
      );
    case "yell":
      return (
        <div>
          <p className="text-lg font-bold">Enchantment</p>
          <p className="text-sm text-gray-500">Cost: {cardDetail.cost}</p>
        </div>
      );
    default:
      return null;
  }
}

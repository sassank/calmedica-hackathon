'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Exchange } from '@prisma/client';
import { Button } from '../ui/button';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Chat } from './chat';
import { cn } from '@/lib/utils';
import { AudioPlayer } from './audio-player';
import { ExchangeBadge } from './exchange-badge';
import { ExchangeStatus } from './exchange-status';

type ExchangeListProps = {
  exchanges: Exchange[];
};

const parseMessages = (text: string) => {
  const json = JSON.parse(text) as {
    conversation: [{ role: 'ASSISTANT' | 'PATIENT'; message: string }];
  };
  return Object.values(json)[0];
};

const parseKeywords = (text: string) => {
  const json = JSON.parse(text) as { [key: string]: string };
  return json;
};

const ExchangeList = ({ exchanges }: ExchangeListProps) => {
  const [selectedExchange, setSelectedExchange] =
    React.useState<Exchange | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4" />
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {exchanges.map((exchange) => (
            <TableRow key={exchange.id}>
              <TableCell className="pl-4">
                <ExchangeStatus status={exchange.status} />
              </TableCell>
              <TableCell>
                <ExchangeBadge type={exchange.type} />
              </TableCell>
              <TableCell>{exchange.date.toDateString()}</TableCell>
              <TableCell>{exchange.category}</TableCell>
              <TableCell className="pr-4 text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedExchange(exchange)}
                >
                  <ChevronRightIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Sheet
        open={!!selectedExchange}
        onOpenChange={(value) => {
          if (!value) setSelectedExchange(null);
        }}
      >
        <SheetContent className="flex flex-col min-w-full lg:min-w-[50%]">
          <SheetHeader className="hidden">
            <SheetTitle>Détails de l'échange</SheetTitle>
            <SheetDescription>Détails de l'échange</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-hidden pt-8">
            <Tabs defaultValue="tab-1" className="h-full flex flex-col">
              <TabsList
                className={cn('grid w-full', {
                  'grid-cols-1': selectedExchange?.type === 'SMS',
                  'grid-cols-3': selectedExchange?.type === 'CALL',
                })}
              >
                {selectedExchange?.type === 'SMS' && (
                  <TabsTrigger value="tab-1">SMS</TabsTrigger>
                )}
                {selectedExchange?.type === 'CALL' && (
                  <>
                    <TabsTrigger value="tab-2">Audio</TabsTrigger>
                    <TabsTrigger value="tab-3">Transcription</TabsTrigger>
                    <TabsTrigger value="tab-4">Résumé</TabsTrigger>
                  </>
                )}
              </TabsList>
              {selectedExchange?.type === 'SMS' && (
                <TabsContent
                  value="tab-1"
                  className="flex-1 overflow-auto pt-4"
                >
                  <Chat messages={parseMessages(selectedExchange.body!)} />
                </TabsContent>
              )}
              {selectedExchange?.type === 'CALL' && (
                <>
                  <TabsContent
                    value="tab-2"
                    className="flex-1 overflow-auto pt-4"
                  >
                    <AudioPlayer src={selectedExchange.body} />
                  </TabsContent>
                  <TabsContent
                    value="tab-3"
                    className="flex-1 overflow-auto pt-4"
                  >
                    <Chat
                      messages={parseMessages(selectedExchange.transcription!)}
                    />
                  </TabsContent>
                  <TabsContent
                    value="tab-4"
                    className="flex-1 overflow-auto pt-4"
                  >
                    <div className="flex flex-col gap-4">
                      <p className="text-sm text-gray-700">
                        {selectedExchange.summary}
                      </p>
                      {Object.keys(
                        parseKeywords(selectedExchange.keywords)
                      ).map((key) =>
                        parseKeywords(selectedExchange.keywords)[key] ? (
                          <div key={key} className="flex flex-col gap-2">
                            <h3 className="font-semibold capitalize">{key}</h3>
                            <p className="text-sm text-gray-700">
                              {parseKeywords(selectedExchange.keywords)[key]}
                            </p>
                          </div>
                        ) : null
                      )}
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export { ExchangeList };

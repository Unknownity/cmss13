import { useBackend, useLocalState } from '../backend';
import {
  Box,
  Button,
  Collapsible,
  Icon,
  Input,
  Section,
  Stack,
} from '../components';
import { Window } from '../layouts';

export const Who = (props, context) => {
  const { act, data } = useBackend(context);
  const {
    admin,
    all_clients,
    total_players = [],
    additional_info = [],
    factions = [],
    xenomorphs = [],
  } = data;

  const [searchQuery, setSearchQuery] = useLocalState('searchQuery', '');

  const searchPlayers = () =>
    total_players.filter((player) => isMatch(player, searchQuery));

  const filteredTotalPlayers = searchPlayers();

  return (
    <Window resizable width={800} height={600}>
      <Window.Content scrollable>
        <Stack fill vertical>
          <Stack.Item>
            <Section>
              <Stack>
                <Stack.Item>
                  <Icon name="search" />
                </Stack.Item>
                <Stack.Item grow>
                  <Input
                    autoFocus
                    fluid
                    onEnter={(e, value) =>
                      act('get_player_panel', {
                        ckey: searchPlayers()?.[0].ckey,
                      })
                    }
                    onInput={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    value={searchQuery}
                  />
                </Stack.Item>
              </Stack>
            </Section>
          </Stack.Item>
          <Stack.Item mt={0.2} grow>
            <Section>
              <WhoCollapsible title={'Players - ' + all_clients} color="good">
                {filteredTotalPlayers.length ? (
                  <Box>
                    {filteredTotalPlayers.map((x) => (
                      <GetPlayerInfo key={x.ckey} admin={admin} player={x} />
                    ))}
                  </Box>
                ) : null}
              </WhoCollapsible>
            </Section>
            {admin !== 0 ? (
              <Section>
                <WhoCollapsible title="Information" color="olive">
                  <Box direction="column">
                    {additional_info.length
                      ? additional_info.map((x, index) => (
                          <GetAddInfo
                            key={index}
                            content={x.content}
                            color={x.color}
                            text={x.text}
                          />
                        ))
                      : null}
                    {factions.length
                      ? factions.map((x, index) => (
                          <GetAddInfo
                            key={index}
                            content={x.content}
                            color={x.color}
                            text={x.text}
                          />
                        ))
                      : null}
                    {xenomorphs.length
                      ? xenomorphs.map((x, index) => (
                          <GetAddInfo
                            key={index}
                            content={x.content}
                            color={x.color}
                            text={x.text}
                          />
                        ))
                      : null}
                  </Box>
                </WhoCollapsible>
              </Section>
            ) : null}
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};

const WhoCollapsible = (props, context) => {
  const { title, color, children } = props;
  return (
    <Collapsible title={title} color={color} open>
      {children}
    </Collapsible>
  );
};

const GetAddInfo = (props, context) => {
  const { act } = useBackend(context);
  const { content, color, text } = props;

  return (
    <Button
      color={'transparent'}
      style={{
        'border-color': color,
        'border-style': 'solid',
        'border-width': '1px',
        color: color,
      }}
      tooltip={text}
      tooltipPosition="bottom-start"
    >
      {content}
    </Button>
  );
};

const GetPlayerInfo = (props, context) => {
  const { act } = useBackend(context);
  const {
    admin,
    player: { ckey, ckey_color, color, text },
  } = props;
  return admin !== 0 ? (
    <Button
      color={'transparent'}
      style={{
        'border-color': admin ? color : '#2185d0',
        'border-style': 'solid',
        'border-width': '1px',
        color: admin ? color : ckey_color,
      }}
      onClick={() => act('get_player_panel', { ckey: ckey })}
      tooltip={text}
      tooltipPosition="bottom-start"
    >
      <div color={ckey_color}>{ckey}</div>
    </Button>
  ) : (
    <Button
      color={'transparent'}
      style={{
        'border-color': '#2185d0',
        'border-style': 'solid',
        'border-width': '1px',
        color: ckey_color,
      }}
    >
      <div color={ckey_color}>{ckey}</div>
    </Button>
  );
};

const isMatch = (player, searchQuery) => {
  if (!searchQuery) {
    return true;
  }

  return (
    player.ckey.toLowerCase().includes(searchQuery?.toLowerCase()) || false
  );
};
